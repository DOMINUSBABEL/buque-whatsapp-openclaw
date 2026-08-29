/**
 * STATE MACHINE
 * Deterministic conversational state machine for prospect interactions on WhatsApp.
 * Handles pricing inquiries, customization requests, objections, and escalations.
 */
const sessionManager = require('./session-manager');
const configManager = require('./config-manager');

class StateMachine {
  async handleMessage(sock, senderJid, rawText) {
    const session = sessionManager.getSession(senderJid);
    const text = (rawText || '').trim().toLowerCase();

    console.log(`[StateMachine] Inbound message from prospect (${session.businessName || senderJid}): "${text}" [State: ${session.pipelineState}]`);

    // 1. PRICE / COST INTENT
    if (this._matchesIntent(text, ['precio', 'costo', 'cuanto vale', 'cuanto cuesta', 'planes', 'tarifa', 'presupuesto'])) {
      const reply = `¡Hola! El lanzamiento de la plataforma para *${session.businessName}* incluye:\n\n` +
                    `• Dominio propio (.com o .co)\n` +
                    `• Servidor ultra-rápido y certificado SSL\n` +
                    `• Catálogo interactivo con botón directo a este WhatsApp\n` +
                    `• Cero comisiones por venta\n\n` +
                    `Tenemos un pago único de activación sin mensualidades forzosas. ¿Te gustaría que agendemos una llamada corta de 10 minutos para mostrártelo funcionando?`;

      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'INTERESTED_PRICE' });
      return;
    }

    // 2. INTEREST / SCHEDULING INTENT
    if (this._matchesIntent(text, ['si', 'me interesa', 'claro', 'agendemos', 'llamada', 'dale', 'cuando', 'de una', 'perfecto'])) {
      const reply = `¡Excelente decisión! 🚀\n\n` +
                    `Puedes elegir el día y la hora que mejor te convenga en este enlace: https://calendly.com/buque-b2b/demo-10min\n\n` +
                    `O si prefieres, dime si te queda bien hoy en la tarde o mañana en la mañana.`;

      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'ESCALATED_CLOSING' });

      // Notify Admins
      await this._notifyAdmins(sock, `🔥 *¡LEAD CALIENTE DETECTADO!* 🔥\n*${session.businessName}* (${senderJid}) quiere agendar demo o coordinar activación.`);
      return;
    }

    // 3. MODIFICATION / LOGO INTENT
    if (this._matchesIntent(text, ['cambiar', 'logo', 'foto', 'precios', 'actualizar', 'menu', 'platos'])) {
      const reply = `Con mucho gusto. El diseño es 100% personalizable con tus fotos, logos, colores corporativos y lista completa de precios.\n\n` +
                    `¿Tienes algún menú o documento en PDF/foto que nos puedas enviar por aquí para integrarlo de una vez?`;

      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'INTERESTED_CHANGES' });
      return;
    }

    // 4. REJECTION / OPT-OUT INTENT
    if (this._matchesIntent(text, ['no gracias', 'no me interesa', 'no deseo', 'borrar', 'remover', 'no molestar', 'spam'])) {
      const reply = `Entendido perfectamente. Muchas gracias por tu tiempo y muchos éxitos con *${session.businessName}*. Que tengas un excelente día.`;
      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'OPTED_OUT' });
      return;
    }

    // 5. DEFAULT OPEN ENGAGEMENT
    const fallback = `Muchas gracias por responder. ¿Tuviste oportunidad de abrir la propuesta en tu celular?\n` +
                     `🔗 ${session.landingPageUrl || 'https://buque.app'}\n\n` +
                     `Cuéntame si te gustaría ajustar algo o si tienes alguna pregunta específica.`;
    await sock.sendMessage(senderJid, { text: fallback });
  }

  _matchesIntent(text, keywords) {
    return keywords.some(kw => text.includes(kw));
  }

  async _notifyAdmins(sock, notificationText) {
    const adminPhones = configManager.get('adminPhoneNumbers', []);
    for (const phone of adminPhones) {
      const adminJid = `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
      try {
        await sock.sendMessage(adminJid, { text: notificationText });
      } catch (err) {
        console.error(`[StateMachine] Failed to notify admin ${adminJid}: ${err.message}`);
      }
    }
  }
}

module.exports = new StateMachine();
