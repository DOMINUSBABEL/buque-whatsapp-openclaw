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
    if (this._matchesIntent(text, ['precio', 'costo', 'cuanto vale', 'cuanto cuesta', 'planes', 'tarifa', 'presupuesto', '100', 'dolares'])) {
      const isVarego = session.serviceType === 'VAREGO_SOCIAL_ADS' || text.includes('redes') || text.includes('varego') || text.includes('ads') || text.includes('pauta');

      let reply = '';
      if (isVarego) {
        reply = `¡Hola! El plan de crecimiento en Redes Sociales & Meta Ads de *VAREGO* para *${session.businessName}* incluye:\n\n` +
                `• Gestión integral de Instagram/Facebook\n` +
                `• Diseño de 12 posts/reels estratégicos al mes\n` +
                `• Creación y optimización de campañas en Meta Ads para generar clientes y liquidez constante\n` +
                `• Copywriting persuasivo y hashtags optimizados\n\n` +
                `💵 *Costo base:* Solo *$100 USD / mes* por la gestión completa. (La inversión en pauta de anuncios la defines y pagas tú directamente a Meta de acuerdo a tu presupuesto).\n\n` +
                `¿Te gustaría agendar una llamada de 10 minutos para definir la estrategia de este mes?`;
      } else {
        reply = `¡Hola! El lanzamiento de la plataforma web y catálogo para *${session.businessName}* incluye:\n\n` +
                `• Dominio propio (.com o .co)\n` +
                `• Servidor ultra-rápido y certificado SSL\n` +
                `• Catálogo interactivo con botón directo a este WhatsApp\n` +
                `• Cero comisiones por venta\n\n` +
                `Tenemos un pago único de activación sin mensualidades forzosas. ¿Te gustaría que agendemos una llamada corta de 10 minutos para mostrártelo funcionando?`;
      }

      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'INTERESTED_PRICE' });
      return;
    }

    // 2. INTEREST / SCHEDULING INTENT
    if (this._matchesIntent(text, ['si', 'me interesa', 'claro', 'agendemos', 'llamada', 'dale', 'cuando', 'de una', 'perfecto', 'reunion', 'cita'])) {
      const bookingUrl = configManager.get('varegoSettings.bookingUrl', 'https://calendly.com/varego-agency/estrategia-social');
      const reply = `¡Excelente decisión! 🚀\n\n` +
                    `Puedes elegir el día y la hora que mejor te convenga en este enlace:\n${bookingUrl}\n\n` +
                    `O si prefieres, dime si te queda mejor hoy en la tarde o mañana en la mañana para coordinar.`;

      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'ESCALATED_CLOSING' });

      // Notify Admins
      await this._notifyAdmins(sock, `🔥 *¡LEAD CALIENTE DETECTADO (ALARICUS)!* 🔥\n*${session.businessName}* (${senderJid}) quiere agendar sesión estratégica.`);
      return;
    }

    // 3. ADS / PAUTA QUESTION INTENT
    if (this._matchesIntent(text, ['pauta', 'anuncios', 'ads', 'meta', 'presupuesto de anuncios', 'publicidad'])) {
      const reply = `Sobre la pauta publicitaria en Meta (Instagram/Facebook):\n\n` +
                    `Tú mantienes el 100% del control de tu presupuesto. Puedes iniciar desde $30, $50 o $100 USD al mes en pauta directamente pagados a Meta, y nosotros nos encargamos de que cada dólar invertido te traiga clientes reales a tu WhatsApp y más liquidez a tu negocio.`;

      await sock.sendMessage(senderJid, { text: reply });
      return;
    }

    // 4. MODIFICATION / LOGO / FEED INTENT
    if (this._matchesIntent(text, ['cambiar', 'logo', 'foto', 'precios', 'actualizar', 'menu', 'platos', 'feed', 'reels'])) {
      const reply = `Con mucho gusto. La propuesta es 100% personalizada con la identidad de tu marca, tus fotos, productos y colores.\n\n` +
                    `¿Tienes algún material o cuenta de referencia que nos puedas compartir por aquí para integrarlo de inmediato?`;

      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'INTERESTED_CHANGES' });
      return;
    }

    // 5. REJECTION / OPT-OUT INTENT
    if (this._matchesIntent(text, ['no gracias', 'no me interesa', 'no deseo', 'borrar', 'remover', 'no molestar', 'spam'])) {
      const reply = `Entendido perfectamente. Muchas gracias por tu tiempo y muchos éxitos con *${session.businessName}*. Que tengas un excelente día.`;
      await sock.sendMessage(senderJid, { text: reply });
      sessionManager.updateSession(senderJid, { pipelineState: 'OPTED_OUT' });
      return;
    }

    // 6. DEFAULT OPEN ENGAGEMENT
    const fallback = `Muchas gracias por responder. ¿Tuviste oportunidad de abrir la propuesta en tu celular?\n` +
                     `🔗 ${session.landingPageUrl || 'https://alaricus.app'}\n\n` +
                     `Cuéntame si te gustaría ajustar algo o si tienes alguna pregunta específica sobre cómo podemos ayudarte a captar más clientes.`;
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
