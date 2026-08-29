/**
 * WHATSAPP SOCKET
 * Initializes and manages the Baileys WebSocket connection with cacheable
 * Signal keystore, automatic reconnects, ghost socket teardown, and event distribution.
 */
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  isJidGroup,
  isJidNewsletter
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const util = require('util');

const AUTH_FOLDER = path.join(__dirname, '..', 'whatsapp_auth_info');
if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER, { recursive: true });

// Silence non-critical companion device desync and libsignal internal logs
const filterSignalNoise = (args) => {
  const msg = args.map(a => {
    if (typeof a === 'string') return a;
    if (a instanceof Error) return a.stack || a.message;
    if (typeof a === 'object' && a !== null) {
      try {
        return util.inspect(a, { depth: 2, maxArrayLength: 5 });
      } catch (e) {
        return '';
      }
    }
    return String(a);
  }).join(' ');

  return msg.includes('Failed to decrypt message') ||
         msg.includes('Bad MAC') ||
         msg.includes('MessageCounterError') ||
         msg.includes('Closing session: SessionEntry') ||
         msg.includes('SessionEntry') ||
         msg.includes('Decrypted message with closed session') ||
         msg.includes('Closing open session in favor of incoming prekey bundle') ||
         msg.includes('_chains:') ||
         msg.includes('currentRatchet:') ||
         msg.includes('pendingPreKey:') ||
         msg.includes('remoteIdentityKey:') ||
         msg.includes('registrationId:') ||
         msg.includes('Connection Closed') ||
         msg.includes('Precondition Required');
};

const originalConsoleError = console.error;
console.error = function(...args) {
  if (filterSignalNoise(args)) return;
  originalConsoleError.apply(console, args);
};

const originalConsoleLog = console.log;
console.log = function(...args) {
  if (filterSignalNoise(args)) return;
  originalConsoleLog.apply(console, args);
};

const originalConsoleInfo = console.info;
console.info = function(...args) {
  if (filterSignalNoise(args)) return;
  originalConsoleInfo.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  if (filterSignalNoise(args)) return;
  originalConsoleWarn.apply(console, args);
};

// In-memory message store for Signal decryption retries
const messageStore = new Map();

/**
 * Auto-Heals Corrupted/Desynchronized Signal Pre-Keys
 */
function autoHealCorruptedSession(senderJid) {
  try {
    const cleanId = senderJid.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sessionFiles = fs.readdirSync(AUTH_FOLDER).filter(f => f.includes(cleanId) || f.startsWith(`session-${senderJid}`));
    for (const f of sessionFiles) {
      fs.unlinkSync(path.join(AUTH_FOLDER, f));
      console.log(`🧹 [Auto-Healer] Purgada pre-clave desfasada para ${senderJid}: ${f}`);
    }
  } catch (e) {
    // Ignore if not present
  }
}

class WhatsAppSocketManager {
  constructor() {
    this.sock = null;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
    this.isConnecting = false;
    this.outboundBotMessageIds = new Set();
  }

  purgeAuthFolder() {
    try {
      if (fs.existsSync(AUTH_FOLDER)) {
        const files = fs.readdirSync(AUTH_FOLDER);
        for (const file of files) {
          try {
            fs.unlinkSync(path.join(AUTH_FOLDER, file));
          } catch (e) {}
        }
        console.log('🧹 [WhatsAppSocket] Credenciales desvinculadas purgadas de whatsapp_auth_info.');
      }
    } catch (err) {
      console.warn(`[WhatsAppSocket] Error purging auth folder: ${err.message}`);
    }
  }

  teardownCurrentSocket() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.sock) {
      try {
        this.sock.ev?.removeAllListeners('connection.update');
        this.sock.ev?.removeAllListeners('creds.update');
        this.sock.ev?.removeAllListeners('messages.upsert');
        if (this.sock.ws) {
          this.sock.ws.removeAllListeners();
          this.sock.ws.close();
        }
        this.sock.end(undefined);
      } catch (e) {}
      this.sock = null;
    }
  }

  async initSocket(onMessageCallback, onQrCallback = null, onPairingCodeCallback = null, targetPhoneNumber = null, onOpenCallback = null, onLoggedOutCallback = null) {
    if (this.isConnecting) {
      return this.sock;
    }
    this.isConnecting = true;

    // Teardown any existing socket before opening a new one to prevent duplicate sessions (Status 440)
    this.teardownCurrentSocket();

    try {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
      const { version, isLatest } = await fetchLatestBaileysVersion();

      console.log(`[WhatsAppSocket] Using Baileys v${version.join('.')}, isLatest: ${isLatest}`);

      const logger = pino({ level: 'silent' });

      this.sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        browser: ['ALARICUS Swarm', 'Chrome', '2.0.0'],
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: false,
        shouldIgnoreJid: (jid) => isJidBroadcast(jid) || isJidNewsletter(jid) || isJidGroup(jid),
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        getMessage: async (key) => {
          if (messageStore.has(key.id)) {
            return messageStore.get(key.id);
          }
          return { conversation: '' };
        }
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && onQrCallback) {
          onQrCallback(qr);
        }

        if (connection === 'close') {
          this.isConnecting = false;
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === 403;
          console.warn(`[WhatsAppSocket] Connection closed (Status: ${statusCode}). Logged out: ${isLoggedOut}`);

          if (isLoggedOut) {
            console.log('\n❌ [WhatsAppSocket] Sesión desvinculada en WhatsApp. Purgando credenciales caducadas...');
            this.purgeAuthFolder();
            this.reconnectAttempts = 0;

            if (onLoggedOutCallback) {
              onLoggedOutCallback();
            } else {
              console.log('🔄 Regenerando nuevo código QR para vincular dispositivo...\n');
              if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
              this.reconnectTimeout = setTimeout(() => {
                this.initSocket(onMessageCallback, onQrCallback, onPairingCodeCallback, targetPhoneNumber, onOpenCallback, onLoggedOutCallback);
              }, 2000);
            }
          } else {
            this.reconnectAttempts++;
            // Exponential backoff capped at 20s
            const delay = Math.min(4000 * Math.pow(1.3, this.reconnectAttempts), 20000);
            console.log(`[WhatsAppSocket] Reconectando en ${Math.round(delay / 1000)}s (Intento #${this.reconnectAttempts})...`);
            
            if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = setTimeout(() => {
              this.initSocket(onMessageCallback, onQrCallback, onPairingCodeCallback, targetPhoneNumber, onOpenCallback, onLoggedOutCallback);
            }, delay);
          }
        } else if (connection === 'open') {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }
          console.log(`[WhatsAppSocket] ✅ ¡Conexión establecida con éxito! Socket activo.`);
          if (onOpenCallback) {
            onOpenCallback(this.sock);
          }
        }
      });

      // Request Pairing Code if phone is provided and not already registered
      if (targetPhoneNumber && !this.sock.authState.creds.registered && onPairingCodeCallback) {
        setTimeout(async () => {
          try {
            const cleanPhone = targetPhoneNumber.replace(/[^0-9]/g, '');
            const code = await this.sock.requestPairingCode(cleanPhone);
            onPairingCodeCallback(code);
          } catch (err) {
            console.error(`[WhatsAppSocket] Error requesting pairing code: ${err.message}`);
          }
        }, 3000);
      }

      // Safe wrap sock.sendMessage to track outbound message IDs and catch disconnected socket errors
      const rawSendMessage = this.sock.sendMessage.bind(this.sock);
      this.sock.sendMessage = async (...args) => {
        try {
          const sent = await rawSendMessage(...args);
          if (sent && sent.key && sent.key.id) {
            this.outboundBotMessageIds.add(sent.key.id);
            if (this.outboundBotMessageIds.size > 2000) {
              const firstKey = this.outboundBotMessageIds.values().next().value;
              this.outboundBotMessageIds.delete(firstKey);
            }
          }
          return sent;
        } catch (sendErr) {
          console.warn(`⚠️ [WhatsAppSocket] No se pudo enviar mensaje a ${args[0]}: ${sendErr.message}`);
          return null;
        }
      };

      // Message listener
      this.sock.ev.on('messages.upsert', async (chatUpdate) => {
        if (chatUpdate.type !== 'notify') return;
        for (const msg of chatUpdate.messages) {
          if (!msg.key) continue;
          if (msg.key.id && this.outboundBotMessageIds.has(msg.key.id)) {
            // Ignore self-echo of messages sent by ALARICUS bot
            continue;
          }
          if (onMessageCallback) {
            try {
              await onMessageCallback(this.sock, msg);
            } catch (msgErr) {
              console.error(`[WhatsAppSocket] Error processing message: ${msgErr.message}`);
            }
          }
        }
      });

      return this.sock;
    } catch (initErr) {
      this.isConnecting = false;
      console.warn(`⚠️ [WhatsAppSocket] Error inicializando socket: ${initErr.message}`);
      if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => {
        this.initSocket(onMessageCallback, onQrCallback, onPairingCodeCallback, targetPhoneNumber, onOpenCallback, onLoggedOutCallback);
      }, 5000);
      return null;
    }
  }

  autoHealSession(senderJid) {
    autoHealCorruptedSession(senderJid);
  }

  getSocket() {
    return this.sock;
  }
}

const socketManager = new WhatsAppSocketManager();
socketManager.autoHealCorruptedSession = autoHealCorruptedSession;

module.exports = socketManager;
