/**
 * OUTREACH DISPATCHER (PITCHER AGENT)
 * Handles sequential dispatch of multimedia pitches via WhatsApp
 * with anti-spam pacing delays (45-120s random jitter) and session binding.
 */
const fs = require('fs');
const sessionManager = require('./session-manager');
const leadDatabase = require('./lead-database');
const configManager = require('./config-manager');

class OutreachDispatcher {
  constructor() {
    this.minDelaySec = configManager.get('scanSettings.pacingDelayMinSeconds', 45);
    this.maxDelaySec = configManager.get('scanSettings.pacingDelayMaxSeconds', 120);
  }

  async dispatchLeadPitch(sock, lead) {
    if (!sock) {
      console.warn(`[OutreachDispatcher] Warning: Socket not connected. Simulating dispatch for ${lead.company_name}.`);
      leadDatabase.updateLead(lead.lead_id, { pipeline_status: 'IN_OUTREACH' });
      return;
    }

    const phone = (lead.contact_channel?.phone_e164 || '').replace(/[^0-9]/g, '');
    if (!phone) {
      console.warn(`[OutreachDispatcher] No valid phone for lead ${lead.company_name}.`);
      return;
    }

    const prospectJid = `${phone}@s.whatsapp.net`;
    const copy = lead.diagnostics?.channel_copies?.whatsapp || 'Hola, tenemos una propuesta para tu negocio.';

    try {
      // 1. Send Video Asset if available
      if (lead.assets?.video_local_path && fs.existsSync(lead.assets.video_local_path)) {
        await sock.sendMessage(prospectJid, {
          video: fs.readFileSync(lead.assets.video_local_path),
          caption: copy,
          mimetype: 'video/mp4'
        });
      } else {
        // Fallback text pitch
        await sock.sendMessage(prospectJid, { text: copy });
      }

      console.log(`[OutreachDispatcher] 📤 Pitch successfully sent to ${lead.company_name} (${prospectJid})`);

      // 2. Bind prospect session
      sessionManager.updateSession(prospectJid, {
        isProspect: true,
        businessName: lead.company_name,
        leadId: lead.lead_id,
        landingPageUrl: lead.assets?.landing_page_url,
        videoAssetUrl: lead.assets?.video_asset_url,
        pipelineState: 'PITCH_DELIVERED',
        createdAt: Date.now()
      });

      leadDatabase.updateLead(lead.lead_id, { pipeline_status: 'IN_OUTREACH' });

      // 3. Pacing Delay with Jitter to protect WhatsApp line
      const delayMs = (Math.floor(Math.random() * (this.maxDelaySec - this.minDelaySec)) + this.minDelaySec) * 1000;
      console.log(`[OutreachDispatcher] ⏳ Waiting pacing delay of ${Math.round(delayMs / 1000)}s before next dispatch...`);
      await new Promise(res => setTimeout(res, delayMs));

    } catch (err) {
      console.error(`[OutreachDispatcher] Error dispatching pitch to ${lead.company_name}: ${err.message}`);
    }
  }
}

module.exports = new OutreachDispatcher();
