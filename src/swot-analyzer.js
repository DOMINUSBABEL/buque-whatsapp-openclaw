/**
 * SWOT (DAFO) STRATEGIC ANALYSIS ENGINE
 * Synthesizes commercial registry, web forensics, social audits, and review sentiment
 * into an executive-grade 4-quadrant strategic intelligence matrix.
 */

class SwotAnalyzer {
  /**
   * Generates a comprehensive SWOT matrix for a target business
   */
  generateSwot(businessData = {}, registryData = {}, forensicsData = {}, socialAudit = {}) {
    const name = businessData.name || 'El Negocio';
    const city = businessData.city || 'la ciudad';
    const neighborhood = businessData.neighborhood || 'la zona';
    const reviews = businessData.user_ratings_total || 0;
    const rating = businessData.rating || 4.0;
    const category = businessData.category || 'Comercio';

    const strengths = [];
    const weaknesses = [];
    const opportunities = [];
    const threats = [];

    // --- 1. FORTALEZAS (Strengths) ---
    if (rating >= 4.5) {
      strengths.push(`Alta reputación percibida (${rating}⭐) con satisfacción comprobada de clientes locales.`);
    }
    if (reviews >= 20) {
      strengths.push(`Base consolidada de opiniones orgánicas en Google Maps (${reviews} valoraciones en ${city}).`);
    }
    if (registryData.verified) {
      strengths.push(`Entidad legalmente matriculada en ${registryData.registry_source || 'Cámara de Comercio'} con ${registryData.legal_data?.years_in_business || 3} años de trayectoria comercial.`);
    }
    strengths.push(`Posicionamiento físico estratégico en el barrio ${neighborhood}.`);

    // --- 2. DEBILIDADES (Weaknesses) ---
    if (!forensicsData.has_website || forensicsData.status === 'DIGITAL_VACANCY') {
      weaknesses.push('Inexistencia de un canal web directo oficial; fuga de clientes hacia terceros o intermediarios.');
    } else if (forensicsData.conversion_friction_index >= 50) {
      weaknesses.push(`Fricciones de conversión en su web actual: ${forensicsData.issues_detected?.join(', ') || 'carga lenta y falta de pedidos directos'}.`);
    }

    if (socialAudit.social_dormant) {
      weaknesses.push(`Presencia en redes (${socialAudit.instagram_handle || 'Instagram'}) inactiva hace más de ${socialAudit.last_post_days_ago || 30} días sin publicaciones periódicas.`);
    }
    if (!socialAudit.active_meta_ads) {
      weaknesses.push('Ausencia de campañas pagadas activas en Meta Ads para prospección continua de clientes en el sector.');
    }

    // --- 3. OPORTUNIDADES (Opportunities) ---
    opportunities.push(`Captura del tráfico de búsquedas locales en ${neighborhood} con un catálogo interactivo indexado.`);
    opportunities.push('Automatización de recepción de pedidos directamente en WhatsApp sin pagar comisiones de intermediarios (15-30%).');
    opportunities.push(`Estrategia de Meta Ads geolocalizada con radio de 3 km alrededor de ${neighborhood} para atraer nuevos clientes.`);
    opportunities.push('Aumento del ticket promedio mediante promociones cruzadas y catálogo visual interactivo.');

    // --- 4. AMENAZAS (Threats) ---
    threats.push('Competidores del mismo sector en la zona adoptando canales de venta directa y pauta agresiva.');
    threats.push('Dependencia de plataformas externas que erosionan el margen de utilidad y retienen la base de datos de clientes.');
    threats.push('Obsolescencia en la captación de nuevas generaciones de consumidores que demandan compra móvil inmediata.');

    // Strategic Posture Assessment
    let strategicPosture = 'EXPANSIÓN_DIGITAL';
    if (!forensicsData.has_website && socialAudit.social_dormant) {
      strategicPosture = 'RESCATE_Y_DIGITALIZACIÓN_TOTAL';
    } else if (!forensicsData.has_website) {
      strategicPosture = 'IMPLANTACIÓN_WEB_DIRECTA';
    } else if (socialAudit.social_dormant) {
      strategicPosture = 'ACTIVACIÓN_VAREGO_SOCIAL_ADS';
    }

    return {
      business_name: name,
      category: category,
      micro_zone: `${neighborhood}, ${city}`,
      strategic_posture: strategicPosture,
      matrix: {
        strengths,
        weaknesses,
        opportunities,
        threats
      },
      digital_gravity_index: Math.round(((rating * 20) + (Math.min(reviews, 100)) + (forensicsData.digital_maturity_score || 20)) / 3)
    };
  }
}

module.exports = new SwotAnalyzer();

// Step: feat(swot): formulate opportunities based on WhatsApp checkout and local search
