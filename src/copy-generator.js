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

    if (route === 'RUTA_A') {
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
                  `Equipo Buque B2B`;

      instagramDm = `Hola @${name} ✨ Les armamos una propuesta de sitio web interactivo para que sus clientes pidan directo a su WhatsApp sin intermediarios. Échenle un ojo aquí: ${landingUrl}`;

      sms = `${name}: Diseñamos su nueva web con pedidos a WhatsApp. Mírela aquí: ${landingUrl} ¿La activamos esta semana?`;
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
                  `Equipo Buque B2B`;

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
