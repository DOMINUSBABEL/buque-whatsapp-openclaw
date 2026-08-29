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

function extractMessageText(msg) {
  if (!msg || !msg.message) return '';
  const m = msg.message;
  return m.conversation ||
         m.extendedTextMessage?.text ||
         m.imageMessage?.caption ||
         m.videoMessage?.caption ||
         '';
}

async function handleIncomingMessage(sock, msg) {
  if (!msg.key || msg.key.fromMe) return;

  const senderJid = msg.key.remoteJid;
  if (!senderJid || senderJid.endsWith('@g.us') || senderJid.endsWith('@broadcast')) {
    // Ignore group and broadcast status updates
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
      leadDatabase.isDuplicate(+) ||
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
