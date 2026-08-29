/**
 * WHATSAPP SOCKET
 * Initializes and manages the Baileys WebSocket connection with cacheable
 * Signal keystore, automatic reconnects, and event distribution.
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

const AUTH_FOLDER = path.join(__dirname, '..', 'whatsapp_auth_info');
if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER, { recursive: true });

// Silence non-critical companion device desync warnings
const originalConsoleError = console.error;
console.error = function(...args) {
  const msg = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
  if (msg.includes('Failed to decrypt message') || msg.includes('Bad MAC') || msg.includes('MessageCounterError') || msg.includes('Closing session: SessionEntry')) {
    return;
  }
  originalConsoleError.apply(console, args);
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
  }

  async initSocket(onMessageCallback, onQrCallback = null, onPairingCodeCallback = null, targetPhoneNumber = null, onOpenCallback = null) {
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
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.warn(`[WhatsAppSocket] Connection closed (Status: ${statusCode}). Reconnect: ${shouldReconnect}`);

        if (shouldReconnect) {
          this.reconnectAttempts++;
          const delay = Math.min(5000 * Math.pow(1.5, this.reconnectAttempts), 60000);
          console.log(`[WhatsAppSocket] Reconnecting in ${Math.round(delay / 1000)}s (Attempt #${this.reconnectAttempts})...`);
          setTimeout(() => {
            this.initSocket(onMessageCallback, onQrCallback, onPairingCodeCallback, targetPhoneNumber, onOpenCallback);
          }, delay);
        } else {
          console.error(`[WhatsAppSocket] Logged out. Manual re-authentication required.`);
        }
      } else if (connection === 'open') {
        console.log(`[WhatsAppSocket] ✅ Connection established successfully! Socket active.`);
        this.reconnectAttempts = 0;
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

    // Message listener
    this.sock.ev.on('messages.upsert', async (chatUpdate) => {
      if (chatUpdate.type !== 'notify') return;
      for (const msg of chatUpdate.messages) {
        if (!msg.key) continue;
        if (onMessageCallback) {
          await onMessageCallback(this.sock, msg);
        }
      }
    });

    return this.sock;
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
