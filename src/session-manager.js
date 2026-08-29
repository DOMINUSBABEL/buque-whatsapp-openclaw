/**
 * SESSION MANAGER
 * Handles persistent state for operators and prospects with TTL expiration,
 * atomic file operations, and lock handling.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'user_sessions.json');
const SESSION_TTL_MS = 72 * 60 * 60 * 1000; // 72 Hours TTL

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class SessionManager {
  constructor() {
    this.sessions = {};
    this.loadSessions();
  }

  loadSessions() {
    try {
      if (fs.existsSync(SESSIONS_FILE)) {
        const raw = fs.readFileSync(SESSIONS_FILE, 'utf8');
        this.sessions = JSON.parse(raw);
      }
    } catch (err) {
      console.warn(`[SessionManager] Error loading sessions: ${err.message}. Starting fresh.`);
      this.sessions = {};
    }
  }

  saveSessions() {
    try {
      const tempPath = `${SESSIONS_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.sessions, null, 2), 'utf8');
      fs.renameSync(tempPath, SESSIONS_FILE);
    } catch (err) {
      console.error(`[SessionManager] Failed to persist sessions: ${err.message}`);
    }
  }

  getInitialState(jid) {
    return {
      jid,
      isProspect: false,
      isAdmin: false,
      businessName: '',
      pipelineState: 'IDLE',
      leadId: null,
      landingPageUrl: null,
      videoAssetUrl: null,
      messagesCount: 0,
      notes: [],
      createdAt: Date.now(),
      lastInteraction: Date.now()
    };
  }

  getSession(jid) {
    const now = Date.now();
    if (!this.sessions[jid]) {
      this.sessions[jid] = this.getInitialState(jid);
      this.saveSessions();
    } else {
      if (now - this.sessions[jid].lastInteraction > SESSION_TTL_MS) {
        this.sessions[jid] = this.getInitialState(jid);
        this.saveSessions();
      }
    }
    return this.sessions[jid];
  }

  updateSession(jid, updates) {
    const session = this.getSession(jid);
    Object.assign(session, updates, { lastInteraction: Date.now() });
    this.saveSessions();
    return session;
  }

  getGlobalStats() {
    const all = Object.values(this.sessions);
    const prospects = all.filter(s => s.isProspect);
    return {
      totalSessions: all.length,
      totalProspects: prospects.length,
      activeConversations: prospects.filter(s => s.pipelineState !== 'IDLE' && s.pipelineState !== 'ARCHIVED').length,
      escalatedCount: prospects.filter(s => s.pipelineState === 'ESCALATED_CLOSING' || s.pipelineState === 'ESCALATED_HUMAN').length
    };
  }
}

module.exports = new SessionManager();
