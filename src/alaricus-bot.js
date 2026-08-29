/**
 * ALARICUS B2B AUTONOMOUS ACQUISITION SWARM (OPENCLAW ENTRYPOINT)
 * Multi-service prospecting harness: Web Directa (Rutas A/B) + VAREGO Social & Ads (Ruta C)
 * Initializes WhatsApp Socket, Live Preview/Dashboard server, and state machines.
 */
const whatsappSocket = require('./whatsapp-socket');
const previewServer = require('./preview-server');
const configManager = require('./config-manager');
const onboardingWizard = require('./onboarding-wizard');
const adminCommands = require('./admin-commands');
const stateMachine = require('./state-machine');
const signalHealer = require('./signal-healer');
const leadDatabase = require('./lead-database');
const sessionManager = require('./session-manager');

/**
 * Desempaqueta mensajes anidados (Ephemeral, ViewOnce, DocumentWithCaption, Editados)
 */
function getUnpackedMessage(message) {
  if (!message) return null;
  if (message.ephemeralMessage?.message) return getUnpackedMessage(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return getUnpackedMessage(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2?.message) return getUnpackedMessage(message.viewOnceMessageV2.message);
  if (message.documentWithCaptionMessage?.message) return getUnpackedMessage(message.documentWithCaptionMessage.message);
  if (message.editedMessage?.message?.protocolMessage?.editedMessage) return getUnpackedMessage(message.editedMessage.message.protocolMessage.editedMessage);
  return message;
}

function extractMessageText(rawMsg) {
  if (!rawMsg) return '';
  const message = getUnpackedMessage(rawMsg.message || rawMsg);
  if (!message) return '';
  if (typeof message === 'string') return message;

  return message.conversation ||
         message.extendedTextMessage?.text ||
         message.imageMessage?.caption ||
         message.videoMessage?.caption ||
         message.documentMessage?.caption ||
         message.buttonsResponseMessage?.selectedButtonId ||
         message.listResponseMessage?.singleSelectReply?.selectedRowId ||
         message.templateButtonReplyMessage?.selectedId ||
         '';
}

async function handleIncomingMessage(sock, msg) {
  if (!msg.key || msg.key.fromMe) return;

  const senderJid = msg.key.remoteJid;
  if (!senderJid || senderJid.endsWith('@g.us') || senderJid.endsWith('@broadcast') || senderJid.endsWith('@newsletter')) {
    // Ignore group, newsletter, and broadcast status updates
    return;
  }

  const rawText = extractMessageText(msg);
  if (!rawText.trim()) return;

  const senderNumber = senderJid.replace(/[^0-9]/g, '');
  const isAdmin = configManager.isAdmin(senderNumber);

  if (isAdmin && rawText.trim().startsWith('!')) {
    // Direct Admin Execution across authorized administrator channels
    await adminCommands.handleCommand(sock, senderJid, rawText);
  } else {
    // Channel Protection: Ensure sender is an active prospect in the acquisition pipeline
    const session = sessionManager.getSession(senderJid);
    const isTrackedLead = session.isProspect ||
      leadDatabase.isDuplicate(`+${senderNumber}`) ||
      leadDatabase.isDuplicate(senderNumber);

    if (isTrackedLead) {
      // Prospect Message Debounced & Routed to Conversational State Machine
      signalHealer.debounceMessage(senderJid, rawText, async (aggregatedText) => {
        await stateMachine.handleMessage(sock, senderJid, aggregatedText);
      });
    }
  }
}

async function startServer() {
  console.clear();
  console.log('⚔️  Initializing ALARICUS B2B Swarm Server (v2.0.0)...');

  // 1. Start Live Preview / Dashboard Server
  await previewServer.start();

  // 2. Run Onboarding Choice
  const { method, phoneNumber } = await onboardingWizard.askPairingChoice();

  // 3. Connect WhatsApp Socket
  await whatsappSocket.initSocket(
    handleIncomingMessage,
    (qr) => {
      if (method === 'QR') onboardingWizard.renderQr(qr);
    },
    (code) => {
      if (method === 'PAIRING_CODE') onboardingWizard.renderPairingCode(code);
    },
    phoneNumber
  );
}

if (require.main === module) {
  startServer().catch(err => {
    console.error('Fatal Server Error:', err);
    process.exit(1);
  });
}

module.exports = { startServer, handleIncomingMessage };
