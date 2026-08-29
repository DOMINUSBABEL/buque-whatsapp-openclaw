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

  // 1. ADMIN COMMAND EXECUTION & ASSISTED DIALOGUE
  if (isAdmin) {
    if (rawText.trim().startsWith('!')) {
      console.log(`⚙️ [AdminCommand] 🚀 Ejecutando comando "${rawText.trim()}" solicitado por [${senderNumber}]...`);
      await adminCommands.handleCommand(sock, senderJid, rawText);
      return;
    }

    // Intercept natural conversation if in Assisted Copilot Mode
    const handledByAssistant = await assistantMode.handleAssistedConversation(sock, senderJid, rawText);
    if (handledByAssistant) return;
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

const readline = require('readline');
const swarmOrchestrator = require('./swarm-orchestrator');
const socialAuditor = require('./social-auditor');
const assistantMode = require('./assistant-mode');
const mapVisionScout = require('./map-vision-scout');

let replInitialized = false;

function setupTerminalRepl() {
  if (replInitialized) return;
  replInitialized = true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'ALARICUS> '
  });

  setTimeout(() => rl.prompt(), 1000);

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    const clean = input.startsWith('!') ? input.slice(1) : input;
    const parts = clean.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'scan':
      case 'escanear':
        if (!args) {
          console.log('⚠️ Uso: scan <nicho> en <ciudad> (Ej: scan panaderias en Chemnitz Alemania)');
        } else {
          console.log(`\n🚀 [Terminal] Iniciando escaneo y curaduría Web Directa para: "${args}"...`);
          await swarmOrchestrator.runScanBatch(args, { limit: 5, targetService: 'WEB' }, (lead) => {
            console.log(`✨ Lead verificado: ${lead.company_name} (${lead.location?.country} ${lead.contact_channel?.phone_e164}) | Web: ${lead.assets?.landing_page_url}`);
          });
        }
        break;

      case 'scan-varego':
      case 'varego':
        if (!args) {
          console.log('⚠️ Uso: scan-varego <nicho> en <ciudad> (Ej: scan-varego gastrobares en Medellin)');
        } else {
          console.log(`\n⚡ [Terminal] Iniciando prospección VAREGO ($100/mo) para: "${args}"...`);
          await swarmOrchestrator.runScanBatch(args, { limit: 5, targetService: 'VAREGO' }, (lead) => {
            console.log(`🔥 Lead VAREGO verificado: ${lead.company_name} (${lead.location?.country} ${lead.contact_channel?.phone_e164}) | Propuesta: ${lead.assets?.landing_page_url}`);
          });
        }
        break;

      case 'mapa':
      case 'map':
        if (!args) {
          console.log('⚠️ Uso: mapa <ruta_archivo_imagen>');
        } else {
          try {
            console.log(`\n🗺️ [Terminal] Analizando mapa: "${args}"...`);
            const mapRes = await mapVisionScout.analyzeMapImage(args);
            console.log(`📍 Ubicación detectada: ${mapRes.detected_location.city} (${mapRes.detected_location.country} ${mapRes.detected_location.country_dialing_code})`);
            console.log('🏢 Negocios extraídos:');
            mapRes.extracted_business_pins.forEach((p, i) => console.log(`   ${i + 1}. ${p.pin_name} (${p.category}) - ${p.quadrant}`));
          } catch (e) {
            console.error(`❌ Error: ${e.message}`);
          }
        }
        break;

      case 'audit-social':
      case 'audit':
        if (!args) {
          console.log('⚠️ Uso: audit-social <nombre o handle>');
        } else {
          console.log(`\n📊 [Terminal] Auditando presencia social de "${args}"...`);
          const res = await socialAuditor.auditBusiness({ name: args, user_ratings_total: 25 });
          console.log(`• Instagram: ${res.instagram_handle}`);
          console.log(`• Último Post: Hace ${res.last_post_days_ago} días (${res.social_dormant ? '🔴 Dormante' : '🟢 Activo'})`);
          console.log(`• Diagnóstico: ${res.audit_summary}`);
        }
        break;

      case 'estado':
      case 'status':
        const stats = leadDatabase.getStats();
        const sessStats = sessionManager.getGlobalStats();
        console.log('\n📊 ESTADO DEL SWARM ALARICUS:');
        console.log(`• Total Leads: ${stats.totalLeads} (Ruta A: ${stats.routeACount}, Ruta B: ${stats.routeBCount}, Ruta C VAREGO: ${stats.routeCCount || 0})`);
        console.log(`• MRR Potencial VAREGO: $${(stats.routeCCount || 0) * 100} USD/mes`);
        console.log(`• Pitches Despachados: ${stats.dispatchedCount}`);
        console.log(`• Conversaciones Activas: ${sessStats.activeConversations}`);
        console.log(`• Pipeline: ${swarmOrchestrator.isPaused ? 'PAUSADO' : 'ACTIVO'}\n`);
        break;

      case 'relink':
      case 'qr':
        console.log('\n🔄 [Terminal] Forzando regeneración de código QR...');
        whatsappSocket.purgeAuthFolder();
        const choice = await onboardingWizard.askPairingChoice();
        await whatsappSocket.initSocket(
          handleIncomingMessage,
          (qr) => { if (choice.method === 'QR') onboardingWizard.renderQr(qr); },
          (code) => { if (choice.method === 'PAIRING_CODE') onboardingWizard.renderPairingCode(code); },
          choice.phoneNumber
        );
        break;

      case 'dashboard':
        console.log('\n🌐 Dashboard URL: http://localhost:3000/dashboard\n');
        break;

      case 'exit':
      case 'salir':
        console.log('Cerrando servidor ALARICUS...');
        process.exit(0);
        break;

      case 'help':
      case 'ayuda':
      default:
        console.log('\n⌨️  COMANDOS DISPONIBLES EN ESTA TERMINAL:');
        console.log(' • scan <nicho> en <ciudad>        -> Iniciar escaneo para Web Directa');
        console.log(' • scan-varego <nicho> en <ciudad> -> Iniciar escaneo para VAREGO ($100/mo)');
        console.log(' • mapa <ruta_imagen>              -> Analizar captura de Google Maps');
        console.log(' • audit-social <handle>           -> Auditar cuenta de Instagram');
        console.log(' • status / estado                 -> Ver métricas y MRR');
        console.log(' • qr / relink                     -> Limpiar sesión y regenerar QR');
        console.log(' • dashboard                       -> Ver URL del panel web');
        console.log(' • exit                            -> Cerrar el servidor\n');
        break;
    }

    rl.prompt();
  });
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
      console.log('💬 Puedes interactuar desde WhatsApp o escribiendo comandos aquí mismo:');
      console.log('   • Escribe "ayuda" o "help" para ver los comandos de esta terminal');
      console.log('   • O envía "!ayuda" desde WhatsApp a este número');
      console.log('========================================================================\n');

      setupTerminalRepl();
    },
    async () => {
      // On Logged Out Callback: Auto-relaunch onboarding wizard
      console.log('🔄 [Auto-Relink] Sesión expirada. Regenerando nuevo código QR en terminal...\n');
      const relinkChoice = await onboardingWizard.askPairingChoice();
      await whatsappSocket.initSocket(
        handleIncomingMessage,
        (qr) => {
          if (relinkChoice.method === 'QR') onboardingWizard.renderQr(qr);
        },
        (code) => {
          if (relinkChoice.method === 'PAIRING_CODE') onboardingWizard.renderPairingCode(code);
        },
        relinkChoice.phoneNumber
      );
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
