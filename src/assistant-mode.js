/**
 * ASSISTANT MODE (Human-in-the-Loop & Interactive Guided Scouting)
 * Manages guided question-and-answer onboarding for campaigns,
 * interactive clarification of niches and geographic targets,
 * and pre-flight approval gates before any WhatsApp dispatch.
 */
const swarmOrchestrator = require('./swarm-orchestrator');
const leadDatabase = require('./lead-database');
const outreachDispatcher = require('./outreach-dispatcher');
const curatorEngine = require('./curator-engine');

class AssistantMode {
  constructor() {
    this.operatorStates = new Map(); // senderJid -> state object
  }

  getOperatorState(senderJid) {
    if (!this.operatorStates.has(senderJid)) {
      this.operatorStates.set(senderJid, {
        mode: 'AUTO', // 'AUTO' or 'ASSISTED'
        step: 'IDLE',
        campaign: {
          niche: null,
          location: null,
          serviceType: 'AUTO',
          targetCountry: null
        },
        pendingApprovalLeads: []
      });
    }
    return this.operatorStates.get(senderJid);
  }

  setMode(senderJid, mode) {
    const state = this.getOperatorState(senderJid);
    state.mode = mode.toUpperCase();
    if (state.mode === 'ASSISTED') {
      state.step = 'AWAITING_NICHE';
    } else {
      state.step = 'IDLE';
    }
    return state.mode;
  }

  async handleAssistedConversation(sock, senderJid, text) {
    const state = this.getOperatorState(senderJid);
    const cleanText = text.trim();

    // 1. Switch commands
    if (cleanText.toLowerCase() === '!asistido' || cleanText.toLowerCase() === '!copiloto') {
      this.setMode(senderJid, 'ASSISTED');
      const msg = `🤝 *MODO ASISTIDO ACTIVADO (Copiloto ALARICUS)*\n\n` +
                  `Te guiaré paso a paso para estructurar tu campaña de prospección con verificación estricta.\n\n` +
                  `📌 *Paso 1/3:* ¿Qué nicho o tipo de negocio deseas buscar?\n` +
                  `_(Ej: Panaderías, Clínicas Dentales, Gastrobares, Talleres Mecánicos)_`;
      await sock.sendMessage(senderJid, { text: msg });
      return true;
    }

    if (cleanText.toLowerCase() === '!auto' || cleanText.toLowerCase() === '!automatico') {
      this.setMode(senderJid, 'AUTO');
      const msg = `⚡ *MODO AUTOMÁTICO ACTIVADO*\n` +
                  `Ahora puedes ejecutar comandos directos como:\n` +
                  `• \`!scan [nicho] en [ciudad]\` (Web Directa)\n` +
                  `• \`!scan-varego [nicho] en [ciudad]\` (VAREGO Social & Ads)\n` +
                  `El enjambre prospectará y filtrará de forma autónoma.`;
      await sock.sendMessage(senderJid, { text: msg });
      return true;
    }

    // Approval commands
    if (cleanText.toLowerCase().startsWith('!aprobar-todos') || cleanText.toLowerCase().startsWith('!aprobar todos')) {
      if (state.pendingApprovalLeads.length === 0) {
        await sock.sendMessage(senderJid, { text: '⚠️ No hay prospectos pendientes de aprobación en este momento.' });
        return true;
      }

      await sock.sendMessage(senderJid, {
        text: `🚀 *Aprobación Confirmada:* Despachando ${state.pendingApprovalLeads.length} prospectos verificados con espaciado anti-spam...`
      });

      for (const lead of state.pendingApprovalLeads) {
        await outreachDispatcher.dispatchLeadPitch(sock, lead);
      }
      state.pendingApprovalLeads = [];
      state.step = 'IDLE';
      return true;
    }

    if (cleanText.toLowerCase().startsWith('!descartar')) {
      state.pendingApprovalLeads = [];
      state.step = 'IDLE';
      await sock.sendMessage(senderJid, { text: '🗑️ Prospectos descartados. Puedes iniciar una nueva consulta.' });
      return true;
    }

    // Step by step guided conversation
    if (state.mode === 'ASSISTED') {
      if (state.step === 'AWAITING_NICHE') {
        state.campaign.niche = cleanText;
        state.step = 'AWAITING_LOCATION';
        const msg = `✅ Nicho registrado: *${cleanText}*\n\n` +
                    `📌 *Paso 2/3:* ¿En qué ciudad y país están ubicados?\n` +
                    `_(Ej: Chemnitz - Alemania, Medellín - Colombia, Madrid - España)_`;
        await sock.sendMessage(senderJid, { text: msg });
        return true;
      }

      if (state.step === 'AWAITING_LOCATION') {
        state.campaign.location = cleanText;
        state.campaign.targetCountry = curatorEngine.detectTargetCountry(cleanText);
        state.step = 'AWAITING_SERVICE';

        const msg = `✅ Ubicación registrada: *${cleanText}* (Prefijo: +${state.campaign.targetCountry.code} - ${state.campaign.targetCountry.name})\n\n` +
                    `📌 *Paso 3/3:* ¿Qué servicio deseas ofrecer?\n` +
                    `[1] 🌐 *Web Directa & Catálogo* (Sin Web / Fricción)\n` +
                    `[2] 📱 *VAREGO Social & Meta Ads* ($100 USD/mes base + pauta cliente)\n` +
                    `[3] ⚡ *Ambos / Detección Automática*\n\n` +
                    `_Responde con 1, 2 o 3:_`;
        await sock.sendMessage(senderJid, { text: msg });
        return true;
      }

      if (state.step === 'AWAITING_SERVICE') {
        let service = 'AUTO';
        if (cleanText === '1') service = 'WEB';
        if (cleanText === '2') service = 'VAREGO';
        state.campaign.serviceType = service;
        state.step = 'PROCESSING';

        const fullQuery = `${state.campaign.niche} en ${state.campaign.location}`;
        await sock.sendMessage(senderJid, {
          text: `🔍 *Iniciando Búsqueda y Curaduría de Datos para:*\n"${fullQuery}"\n` +
                `🛡️ Verificando coherencia geográfica (+${state.campaign.targetCountry.code}) y categoría...`
        });

        // Run batch without immediate auto-dispatch (Pre-Flight Review Gate)
        const leads = await swarmOrchestrator.runScanBatch(fullQuery, {
          limit: 3,
          targetService: service
        });

        state.pendingApprovalLeads = leads;

        if (leads.length === 0) {
          state.step = 'IDLE';
          await sock.sendMessage(senderJid, {
            text: `⚠️ No se encontraron prospectos que superaran los filtros de curaduría para "${fullQuery}". Intenta con otra ciudad o nicho.`
          });
          return true;
        }

        let summary = `📋 *PROSPECTOS CURADOS LISTOS PARA REVISIÓN (${leads.length}):*\n\n`;
        leads.forEach((l, idx) => {
          summary += `*${idx + 1}. ${l.company_name}*\n` +
                     `📍 ${l.location?.city} (${l.scout_metadata?.category})\n` +
                     `📞 Tel Verificado: ${l.contact_channel?.phone_e164}\n` +
                     `🌐 Propuesta Generada: ${l.assets?.landing_page_url}\n` +
                     `🎯 Ruta: ${l.lead_route} | Score: ${l.diagnostics?.lead_score}/100\n\n`;
        });

        summary += `👉 *Para autorizar el envío a estos prospectos, responde:*\n` +
                   `• \`!aprobar-todos\` ➔ Despachar pitches por WhatsApp.\n` +
                   `• \`!descartar\` ➔ Cancelar esta tanda.`;

        await sock.sendMessage(senderJid, { text: summary });
        state.step = 'AWAITING_APPROVAL';
        return true;
      }
    }

    return false;
  }
}

module.exports = new AssistantMode();
