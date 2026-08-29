/**
 * CONFIG MANAGER
 * Manages configuration resolution with hierarchical priority:
 * 1. Environment variables (process.env)
 * 2. Local config file (bot_config.json)
 * 3. Default fallback constants
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const CONFIG_FILE = path.join(__dirname, '..', 'bot_config.json');

const DEFAULT_CONFIG = {
  botName: 'ALARICUS B2B Swarm',
  version: '2.0.0',
  adminPhoneNumbers: ['573001234567'],
  commandPrefix: '!',
  serverPort: 3000,
  publicBaseUrl: 'http://localhost:3000',
  varegoSettings: {
    agencyName: 'VAREGO',
    baseMonthlyFeeUsd: 100,
    currency: 'USD',
    adSpendClause: 'Pauta publicitaria cubierta y administrada por el cliente',
    deliverables: [
      'Diseño y publicación de 12 posts/reels mensuales',
      'Estrategia de contenido y copys persuasivos',
      'Configuración y optimización de campañas de Meta Ads',
      'Reporte mensual de rendimiento y alcance'
    ],
    minReviewsForSocialAudit: 15,
    dormantThresholdDays: 25,
    bookingUrl: 'https://calendly.com/varego-agency/estrategia-social'
  },
  scanSettings: {
    defaultQuotaPerBatch: 20,
    maxDailyInspections: 220,
    minReviewsForRouteA: 5,
    maxRatingForRouteB: 3.9,
    minReviewsForRouteC: 15,
    pacingDelayMinSeconds: 45,
    pacingDelayMaxSeconds: 120
  },
  qaSettings: {
    maxHttpLatencyMs: 1500,
    requireMxValidation: false,
    strictE164Validation: true
  }
};

class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    let fileConfig = {};
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
        fileConfig = JSON.parse(raw);
      }
    } catch (err) {
      console.warn(`[ConfigManager] Warning reading config file: ${err.message}. Using defaults.`);
    }

    // Override with environment variables if present
    const envAdmins = process.env.ADMIN_PHONE_NUMBERS
      ? process.env.ADMIN_PHONE_NUMBERS.split(',').map(s => s.trim().replace(/\+/g, ''))
      : null;

    const merged = {
      ...DEFAULT_CONFIG,
      ...fileConfig,
      serverPort: parseInt(process.env.PORT || fileConfig.serverPort || DEFAULT_CONFIG.serverPort, 10),
      publicBaseUrl: process.env.PUBLIC_BASE_URL || fileConfig.publicBaseUrl || DEFAULT_CONFIG.publicBaseUrl,
      adminPhoneNumbers: envAdmins || fileConfig.adminPhoneNumbers || DEFAULT_CONFIG.adminPhoneNumbers,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || fileConfig.googleMapsApiKey || '',
      geminiApiKey: process.env.GEMINI_API_KEY || fileConfig.geminiApiKey || ''
    };

    return merged;
  }

  get(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  isAdmin(phoneNumber) {
    if (!phoneNumber) return false;
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    return this.config.adminPhoneNumbers.some(admin => {
      const cleanAdmin = admin.replace(/[^0-9]/g, '');
      return cleanNumber === cleanAdmin || cleanNumber.endsWith(cleanAdmin);
    });
  }

  saveConfig(newConfig) {
    try {
      this.config = { ...this.config, ...newConfig };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error(`[ConfigManager] Failed to persist config: ${err.message}`);
      return false;
    }
  }
}

module.exports = new ConfigManager();
