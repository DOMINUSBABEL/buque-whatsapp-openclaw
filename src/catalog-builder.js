/**
 * CATALOG BUILDER
 * Extracts and maps catalog items dynamically from business metadata,
 * reviews, and category heuristics with automated WhatsApp click-to-chat links.
 */
class CatalogBuilder {
  static extractCatalog(businessData) {
    const category = (businessData.category || '').toLowerCase();
    const reviewsSnippets = businessData.reviews_snippets || [];
    const phone = (businessData.phoneE164 || businessData.contact_channel?.phone_e164 || '').replace(/[^0-9]/g, '');

    const items = [];

    // Analyze review keywords to identify actual dishes or popular services
    const dishKeywords = ['hamburguesa', 'pizza', 'sushi', 'tacos', 'pasta', 'asado', 'arepa', 'cafe', 'postre'];
    const serviceKeywords = ['limpieza', 'ortodoncia', 'corte', 'mantenimiento', 'alineacion', 'cambio de aceite', 'masaje'];

    for (const snippet of reviewsSnippets) {
      const lower = snippet.toLowerCase();
      for (const dish of dishKeywords) {
        if (lower.includes(dish) && !items.some(i => i.title.toLowerCase().includes(dish))) {
          items.push({
            title: `Especialidad: ${dish.charAt(0).toUpperCase() + dish.slice(1)}`,
            description: `Plato destacado y elogiado por clientes en reseñas de Maps.`,
            price_tag: 'Favorito del Público'
          });
        }
      }
      for (const srv of serviceKeywords) {
        if (lower.includes(srv) && !items.some(i => i.title.toLowerCase().includes(srv))) {
          items.push({
            title: `Servicio de ${srv.charAt(0).toUpperCase() + srv.slice(1)}`,
            description: `Atención profesional con insumos de primera calidad.`,
            price_tag: 'Servicio Estrella'
          });
        }
      }
    }

    // If no specific items were caught from reviews, fill with category-aware presets
    if (items.length === 0) {
      items.push(
        { title: 'Servicio Principal / Producto Insignia', description: 'Nuestra opción más recomendada con máxima calidad garantizada.', price_tag: 'Destacado' },
        { title: 'Paquete de Ahorro / Combo Directo', description: 'Diseñado para darte el mejor valor sin comisiones extras.', price_tag: 'Mejor Precio' },
        { title: 'Atención Personalizada y Asesoría', description: 'Consulta directamente con nuestro equipo de trabajo por WhatsApp.', price_tag: 'Directo' }
      );
    }

    // Attach WhatsApp trigger links to each item
    return items.slice(0, 4).map(item => ({
      ...item,
      whatsapp_link: `https://wa.me/${phone}?text=Hola,%20quisiera%20pedir%20o%20cotizar:%20${encodeURIComponent(item.title)}`
    }));
  }
}

module.exports = CatalogBuilder;
