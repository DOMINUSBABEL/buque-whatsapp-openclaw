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
  if (!msg.key) return;

  const senderJid = msg.key.remoteJid;
  if (!senderJid || senderJid.endsWith('@g.us') || senderJid.endsWith('@broadcast') || senderJid.endsWith('@newsletter')) {
    // Ignore group, newsletter, and broadcast status updates
    return;
  }

  const rawText = extractMessageText(msg);
  if (!rawText.trim()) return;

  const senderNumber = senderJid.replace(/[^0-9]/g, '');
  const isFromMe = !!msg.key.fromMe;
  const isAdmin = isFromMe || configManager.isAdmin(senderNumber);

  console.log(`\n📩 [WhatsApp Inbound] De: [${senderNumber}] | fromMe: ${isFromMe} | Admin: ${isAdmin}`);
  console.log(`   Texto: "${rawText}"`);

  // 1. ADMIN COMMAND EXECUTION (Supports both remote admin and self-messages from connected phone)
  if (isAdmin && rawText.trim().startsWith('!')) {
    console.log(`⚙️ [AdminCommand] 🚀 Ejecutando comando "${rawText.trim()}" solicitado por [${senderNumber}]...`);
    await adminCommands.handleCommand(sock, senderJid, rawText);
    return;
  }

  // If message was sent by the bot itself and is not a command, ignore
  if (isFromMe) return;

  // 2. PROSPECT ACQUISITION PIPELINE
  const session = sessionManager.getSession(senderJid);
  const isTrackedLead = session.isProspect ||
    leadDatabase.isDuplicate(`+${senderNumber}`) ||
    leadDatabase.isDuplicate(senderNumber);

  if (isTrackedLead) {
    console.log(`🤖 [Prospect] Mensaje de prospecto calificado [${senderNumber}] enrutado a State Machine.`);
    signalHealer.debounceMessage(senderJid, rawText, async (aggregatedText) => {
      await stateMachine.handleMessage(sock, senderJid, aggregatedText);
    });
  } else {
    // BABYLON.IA Rule: Non-prospect conversations on personal device are preserved untouched
    console.log(`🔒 [BABYLON.IA Rule] Chat personal no-prospecto [${senderNumber}] preservado y no intervenido.`);
  }
}

async function startServer() {
  console.clear();
  console.log('⚔️  Inicializando Servidor ALARICUS B2B Swarm (v2.0.0)...');

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
    phoneNumber,
    (sock) => {
      const myJid = sock.user ? sock.user.id.replace(/:.*@/, '@') : 'Desconocido';
      const myCleanNumber = myJid.replace(/[^0-9]/g, '');
      if (myCleanNumber) {
        configManager.addAdmin(myCleanNumber);
      }

      console.log('\n========================================================================');
      console.log('⚔️  ¡ALARICUS SWARM ACTIVO Y ESCUCHANDO EN TIEMPO REAL!');
      console.log(`📱 Línea WhatsApp Conectada: [${myJid}]`);
      console.log(`🌐 Dashboard en Vivo:        http://localhost:3000/dashboard`);
      console.log(`🔑 Estado Administrador:     Auto-autorizado (+${myCleanNumber})`);
      console.log('========================================================================');
      console.log('💬 Puedes probar el enjambre enviando cualquiera de estos comandos por WhatsApp:');
      console.log('   • !ayuda                        -> Ver menú completo de comandos');
      console.log('   • !scan-varego gastrobares      -> Iniciar prospección VAREGO ($100/mo)');
      console.log('   • !scan restaurantes           -> Iniciar prospección Web Directa');
      console.log('   • !audit-social mi_cuenta_ig    -> Auditar Instagram y Meta Ads');
      console.log('   • !estado                       -> Consultar métricas del pipeline');
      console.log('========================================================================\n');
    }
  );
}

if (require.main === module) {
  startServer().catch(err => {
    console.error('Fatal Server Error:', err);
    process.exit(1);
  });
}

module.exports = { startServer, handleIncomingMessage };
