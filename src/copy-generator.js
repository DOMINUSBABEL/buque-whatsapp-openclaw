/**
 * COPY GENERATOR
 * Crafts 4 tailored channel copies (WhatsApp, Email, Instagram DM, SMS)
 * with emotional resonance, route coherence, and clean call-to-actions.
 */
class CopyGenerator {
  static generateCopies(lead) {
    const name = lead.company_name;
    const city = lead.location?.city || 'su ciudad';
    const route = lead.lead_route;
    const landingUrl = lead.assets?.landing_page_url || 'https://buque.app/demo-propuesta';
    const snippet = lead.scout_metadata?.friction_snippet || '';

    let whatsapp = '';
    let emailSubject = '';
    let emailBody = '';
    let instagramDm = '';
    let sms = '';

    const country = lead.location?.country || 'Colombia';
    const isGerman = country === 'Alemania' || country === 'Germany';
    const isEnglish = country === 'Estados Unidos' || country === 'United States';

    if (isGerman) {
      if (route === 'RUTA_C_VAREGO') {
        whatsapp = `Hallo Team von *${name}* 👋\n\n` +
                   `Wir haben Ihren Betrieb in ${city} mit hervorragenden Bewertungen auf Google Maps gesehen. Allerdings wird das Potenzial auf Social Media und Meta Ads noch nicht voll ausgeschöpft.\n\n` +
                   `Mit *VAREGO* übernehmen wir das professionelle Social Media Management für nur *$100 USD / Monat* (Content-Erstellung, Reels & Werbekampagnen; Werbebudget wird transparent und flexibel von Ihnen gesteuert).\n\n` +
                   `🔗 *Strategievorschlag ansehen:* ${landingUrl}\n\n` +
                   `Möchten Sie einen kurzen 10-Minuten-Call vereinbaren?`;
      } else {
        whatsapp = `Hallo Team von *${name}* 👋\n\n` +
                   `Wir haben Ihre Bäckerei/Geschäft in ${city} mit tollen Kundenbewertungen entdeckt. Kunden vermissen jedoch eine direkte moderne Website zur mobilen Einsicht und Bestellung.\n\n` +
                   `Wir haben einen funktionsfähigen Prototyp für Ihr Geschäft erstellt:\n` +
                   `🔗 *Vorschlag ansehen:* ${landingUrl}\n\n` +
                   `Können wir diesen Vorschlag kurz gemeinsam ansehen?`;
      }
      emailSubject = `Digitaler Auftritt & Strategievorschlag für ${name} (${city})`;
      emailBody = `Sehr geehrtes Team von ${name},\n\n` +
                  `Wir haben einen optimierten Prototyp für Ihr Unternehmen in ${city} entwickelt: ${landingUrl}\n\n` +
                  `Mit freundlichen Grüßen,\nALARICUS & VAREGO Team`;
      instagramDm = `Hallo @${name}! Wir haben einen digitalen Prototyp für Sie erstellt: ${landingUrl}`;
      sms = `${name}: Ihr neuer digitaler Webauftritt ist bereit: ${landingUrl}`;

    } else if (isEnglish) {
      if (route === 'RUTA_C_VAREGO') {
        whatsapp = `Hi *${name}* team 👋\n\n` +
                   `We noticed your great reputation in ${city}, but your social channels and Meta Ads have huge untapped growth potential.\n\n` +
                   `At *VAREGO*, we provide full social media management for just *$100 USD/month* (content design, reels, and ad optimization; ad spend managed directly by you).\n\n` +
                   `🔗 *View your custom proposal:* ${landingUrl}\n\n` +
                   `Would you like to schedule a quick 10-minute call this week?`;
      } else {
        whatsapp = `Hi *${name}* team 👋\n\n` +
                   `We noticed your business in ${city} has great customer reviews, but lacks a direct mobile site for WhatsApp orders.\n\n` +
                   `We created a working mobile prototype for you:\n` +
                   `🔗 *View demo:* ${landingUrl}\n\n` +
                   `Would you like to launch it with your domain this week?`;
      }
      emailSubject = `Digital growth proposal for ${name} (${city})`;
      emailBody = `Hi ${name} team,\n\nWe designed a direct mobile solution for your business in ${city}: ${landingUrl}\n\nBest regards,\nALARICUS Team`;
      instagramDm = `Hi @${name}! We created a direct interactive web proposal for your brand: ${landingUrl}`;
      sms = `${name}: We built a mobile catalog for you: ${landingUrl} Interested in launching?`;

    } else if (route === 'RUTA_A') {
      whatsapp = `Hola equipo de *${name}* 👋\n\n` +
                 `Notamos que son un referente en ${city} con excelentes opiniones en Google Maps, pero sus clientes no encuentran una página web oficial con su menú/servicios para ordenar directamente.\n\n` +
                 `Les preparamos este prototipo móvil funcional con sus productos reales y botón de pedidos a WhatsApp:\n` +
                 `🔗 *Ver propuesta:* ${landingUrl}\n\n` +
                 `¿Les gustaría que lo dejemos activo con su propio dominio esta semana?`;

      emailSubject = `Propuesta digital directa para ${name} (${city})`;
      emailBody = `Estimado equipo de ${name},\n\n` +
                  `Revisando las reseñas de sus clientes en ${city}, vemos una alta demanda de sus servicios. Sin embargo, actualmente no cuentan con un sitio web directo para convertir esas búsquedas en clientes sin pagar comisiones a plataformas intermediarias.\n\n` +
                  `Hemos desarrollado un prototipo optimizado para dispositivos móviles:\n` +
                  `${landingUrl}\n\n` +
                  `Podemos ponerlo en marcha en menos de 48 horas con su propio dominio.\n\n` +
                  `Quedo atento a sus comentarios.\n` +
                  `Equipo ALARICUS B2B`;

      instagramDm = `Hola @${name} ✨ Les armamos una propuesta de sitio web interactivo para que sus clientes pidan directo a su WhatsApp sin intermediarios: ${landingUrl}`;
      sms = `${name}: Diseñamos su nueva web con pedidos a WhatsApp. Mírela aquí: ${landingUrl} ¿La activamos esta semana?`;

    } else if (route === 'RUTA_C_VAREGO') {
      const handle = lead.scout_metadata?.social_audit?.instagram_handle || `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      whatsapp = `Hola equipo de *${name}* 👋\n\n` +
                 `Revisamos su presencia comercial en ${city} y tienen excelentes calificaciones de clientes, pero notamos que su cuenta de redes (${handle}) no está aprovechando todo su potencial de atracción con pauta de Meta Ads ni reels continuos.\n\n` +
                 `Desde *VAREGO* manejamos la gestión profesional de sus redes sociales por solo *$100 USD al mes* (creación de contenido, diseño y optimización de anuncios; la inversión en pauta publicitaria es administrada directamente por ustedes a su medida).\n\n` +
                 `Les preparamos este plan visual de crecimiento:\n` +
                 `🔗 *Ver propuesta VAREGO:* ${landingUrl}\n\n` +
                 `¿Les gustaría que coordinemos una breve llamada de 10 minutos para mostrarles la estrategia para este mes?`;

      emailSubject = `Estrategia de crecimiento en Redes Sociales & Meta Ads para ${name} - VAREGO`;
      emailBody = `Estimado equipo de ${name},\n\n` +
                  `Analizando el mercado local en ${city}, vemos que su negocio cuenta con una reputación sobresaliente. Sin embargo, existe una gran oportunidad desaprovechada en la captación de clientes a través de Instagram y Meta Ads.\n\n` +
                  `En VAREGO ofrecemos un servicio de Community Management y administración de pauta de alto impacto con un costo base accesible de $100 USD mensuales (con presupuesto publicitario cubierto directamente por su empresa de forma flexible).\n\n` +
                  `Pueden revisar la propuesta estratégica interactiva aquí:\n` +
                  `${landingUrl}\n\n` +
                  `Quedamos a su disposición para agendar una sesión estratégica.\n\n` +
                  `Cordialmente,\n` +
                  `Equipo VAREGO / ALARICUS`;

      instagramDm = `Hola ${handle} 🚀 Vemos un gran potencial en su marca y les armamos un plan de contenidos y Meta Ads por $100 USD/mes. Mírenlo aquí: ${landingUrl}`;
      sms = `${name}: Activamos sus redes y Meta Ads por $100 USD/mes con VAREGO. Vea su propuesta: ${landingUrl}`;

    } else {
      // RUTA B
      whatsapp = `Hola equipo de *${name}* 👋\n\n` +
                 `Vimos en sus reseñas de Google que varios clientes han tenido dificultades con su página web (${snippet}).\n\n` +
                 `Para solucionarlo, diseñamos una versión modernizada, ultrarrápida y con pedidos directos a su WhatsApp:\n` +
                 `🔗 *Ver solución:* ${landingUrl}\n\n` +
                 `¿Les parece si agendamos una llamada de 10 minutos para mostrársela?`;

      emailSubject = `Optimización de canal web y pedidos para ${name}`;
      emailBody = `Hola equipo de ${name},\n\n` +
                  `Detectamos que algunos usuarios reportaron fallas recientes al navegar o pedir en su plataforma actual. Para evitar fugas de clientes, estructuramos una alternativa optimizada y de carga instantánea:\n\n` +
                  `${landingUrl}\n\n` +
                  `Esta solución resuelve de raíz los problemas reportados y agiliza la atención.\n\n` +
                  `Saludos cordiales,\n` +
                  `Equipo ALARICUS B2B`;

      instagramDm = `Hola @${name} 🚀 Notamos fallas en su web actual y les rediseñamos una versión rápida con catálogo directo: ${landingUrl} ¿La revisamos?`;
      sms = `${name}: Rediseñamos su web resolviendo fallas de pedidos. Mírela: ${landingUrl} ¿Agendamos demo?`;
    }

    return {
      whatsapp,
      email: {
        subject: emailSubject,
        body: emailBody
      },
      instagram_dm: instagramDm,
      sms
    };
  }
}

module.exports = CopyGenerator;
