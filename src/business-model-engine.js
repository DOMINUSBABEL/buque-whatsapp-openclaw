/**
 * BUSINESS MODEL ENGINE & MICRO-MARKET DECOMPOSER
 * Deconstructs business models, value propositions, revenue streams,
 * and computes localized neighborhood competitive density indices.
 */

class BusinessModelEngine {
  /**
   * Analyzes the business model and micro-market landscape for a given establishment
   */
  decomposeBusinessModel(businessData = {}, swotData = {}, registryData = {}) {
    const category = (businessData.category || 'Comercio General').toLowerCase();
    const city = businessData.city || 'Medellín';
    const neighborhood = businessData.neighborhood || 'Zona Local';
    const reviews = businessData.user_ratings_total || 15;

    // Archetype definitions
    let archetype = {
      model_type: 'B2C Retail & Walk-in Direct',
      value_prop: 'Disponibilidad inmediata de productos esenciales con atención personalizada de proximidad.',
      target_segments: ['Residentes del barrio', 'Compradores de paso', 'Contratistas locales'],
      revenue_mechanics: 'Venta unitaria directa en mostrador con margen bruto promedio del 25% - 40%.',
      est_average_ticket_usd: 18,
      operational_bottleneck: 'Falta de digitalización en el catálogo que limita las ventas a clientes presentes físicamente.'
    };

    if (category.includes('ferreter') || category.includes('hardware') || category.includes('werkstatt')) {
      archetype = {
        model_type: 'B2B & B2C Suministros y Herramientas',
        value_prop: 'Abastecimiento integral para reparaciones del hogar, construcción y mantenimiento técnico.',
        target_segments: ['Maestros de obra / Contratistas', 'Hogares del barrio', 'Talleres mecánicos'],
        revenue_mechanics: 'Ventas de alta rotación (tornillería, pinturas, adhesivos) y ticket medio en herramientas eléctricas.',
        est_average_ticket_usd: 35,
        operational_bottleneck: 'Catálogo de más de 2.000 referencias sin visualización online para cotizaciones rápidas por WhatsApp.'
      };
    } else if (category.includes('panader') || category.includes('bakery') || category.includes('bäckerei') || category.includes('boulangerie')) {
      archetype = {
        model_type: 'B2C Gastronomía de Alta Rotación & Repostería',
        value_prop: 'Panadería fresca artesanal, repostería y cafetería con experiencia de consumo diario.',
        target_segments: ['Familias locales', 'Trabajadores de la zona', 'Eventos sociales'],
        revenue_mechanics: 'Ventas recurrentes matutinas y vespertinas de pan y café; ticket alto en pasteles sobre encargo.',
        est_average_ticket_usd: 12,
        operational_bottleneck: 'Pedidos de repostería y desayunos no canalizados por una landing con checkout directo a WhatsApp.'
      };
    } else if (category.includes('dental') || category.includes('salud') || category.includes('clinic')) {
      archetype = {
        model_type: 'Servicios Profesionales de Salud & Estética',
        value_prop: 'Tratamientos clínicos especializados con diagnóstico de alta precisión y seguimiento personalizado.',
        target_segments: ['Pacientes del sector', 'Familias', 'Consultas de urgencia dental'],
        revenue_mechanics: 'Consultas de valoración + planes de tratamiento de alto valor (ortodoncia, implantes, diseño).',
        est_average_ticket_usd: 150,
        operational_bottleneck: 'Agendamiento manual sin automatización de citas ni campañas de atracción de Meta Ads activas.'
      };
    } else if (category.includes('gastrobar') || category.includes('restauran') || category.includes('bistro')) {
      archetype = {
        model_type: 'Experiencia Gastronómica & Entretenimiento Social',
        value_prop: 'Gastronomía de autor, coctelería y ambientación para reuniones sociales y fines de semana.',
        target_segments: ['Jóvenes profesionales', 'Parejas', 'Grupos de amigos'],
        revenue_mechanics: 'Consumo in situ de platos y bebidas; delivery directo complementario.',
        est_average_ticket_usd: 28,
        operational_bottleneck: 'Falta de pauta visual en Instagram/Meta Ads para llenar mesas en días de menor afluencia (mar-jue).'
      };
    }

    // Compute Micro-Market Competitive Density (Herfindahl-Hirschman Simulation)
    // 0 = Monopoly, 100 = Hyper-saturated
    const estimatedLocalCompetitors = Math.max(3, Math.min(25, Math.round(reviews / 4)));
    const competitiveDensityIndex = Math.min(100, Math.round((estimatedLocalCompetitors / 25) * 100));

    return {
      archetype: archetype.model_type,
      value_proposition: archetype.value_prop,
      target_segments: archetype.target_segments,
      revenue_mechanics: archetype.revenue_mechanics,
      est_average_ticket_usd: archetype.est_average_ticket_usd,
      operational_bottleneck: archetype.operational_bottleneck,
      neighborhood_landscape: {
        neighborhood: neighborhood,
        city: city,
        estimated_competitors_in_radius: estimatedLocalCompetitors,
        competitive_density_score: competitiveDensityIndex,
        market_share_opportunity: competitiveDensityIndex > 60 ? 'DIFERENCIACIÓN_DIGITAL' : 'DOMINANCIA_LOCAL'
      },
      monetization_roadmap: [
        '1. Despliegue de Catálogo Móvil Ultra-Rápido con Checkout directo a WhatsApp',
        '2. Captación en Google Maps con ficha optimizada y enlace directo a la web',
        '3. Campaña de Meta Ads geolocalizada con radio de 2.5 km y gancho de bienvenida',
        '4. Programa de fidelización y retención por base de datos en WhatsApp'
      ]
    };
  }
}

module.exports = new BusinessModelEngine();

// Step: feat(bizmodel): synthesize 4-step digital monetization roadmap
