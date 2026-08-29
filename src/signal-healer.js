/**
 * SIGNAL HEALER & MESSAGE DEBOUNCER
 * Purges corrupted pre-keys to prevent Bad MAC/MessageCounterError lockouts,
 * and debounces rapid burst messages per sender within a 2.8-second window.
 */
const fs = require('fs');
const path = require('path');

const AUTH_FOLDER = path.join(__dirname, '..', 'whatsapp_auth_info');
const DEBOUNCE_WINDOW_MS = 2800;
const MAX_BUFFER_ITEMS = 50; // 2.8s burst window

class SignalHealer {
  constructor() {
    this.userMessageBuffers = new Map();
    this.userBufferTimers = new Map();
  }

  /**
   * Purgers desynchronized signal session keys for a given sender
   */
  autoHealCorruptedSession(senderJid) {
    try {
      if (!fs.existsSync(AUTH_FOLDER)) return;
      const cleanId = senderJid.replace(/[^a-zA-Z0-9_-]/g, '_');
      const files = fs.readdirSync(AUTH_FOLDER).filter(f => f.includes(cleanId) || f.startsWith(`session-${senderJid}`));
      for (const f of files) {
        fs.unlinkSync(path.join(AUTH_FOLDER, f));
        console.log(`[SignalHealer] 🧹 Purged desynced session pre-key: ${f}`);
      }
    } catch (err) {
      // Non-blocking cleanup error
    }
  }

  /**
   * Aggregates rapid-fire messages from a sender into a single coherent prompt
   */
  debounceMessage(senderJid, incomingText, processCallback) {
    if (!this.userMessageBuffers.has(senderJid)) {
      this.userMessageBuffers.set(senderJid, []);
    }

    if (incomingText && incomingText.trim().length > 0) {
      this.userMessageBuffers.get(senderJid).push(incomingText.trim());
    }

    if (this.userBufferTimers.has(senderJid)) {
      clearTimeout(this.userBufferTimers.get(senderJid));
    }

    const timer = setTimeout(async () => {
      const texts = this.userMessageBuffers.get(senderJid) || [];
      this.userMessageBuffers.delete(senderJid);
      this.userBufferTimers.delete(senderJid);

      const aggregatedText = texts.join('\n');
      if (aggregatedText.trim().length > 0 && processCallback) {
        await processCallback(aggregatedText);
      }
    }, DEBOUNCE_WINDOW_MS);

    this.userBufferTimers.set(senderJid, timer);
  }
}

module.exports = new SignalHealer();
