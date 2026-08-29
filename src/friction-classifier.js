/**
 * FRICTION CLASSIFIER
 * Classifies raw scouted places into RUTA_A (No website) or RUTA_B (Website with friction)
 * based on review heuristics, keyword matching, and contact availability.
 */
const FRICTION_KEYWORDS = [
  'página', 'pagina', 'web', 'menú online', 'menu online',
  'error', 'no funciona', 'link roto', 'pedir online',
  'no contestan', 'caída', 'caida', 'no carga', 'formulario roto'
];

class FrictionClassifier {
  static classify(place, options = {}) {
    const targetService = options.targetService || 'AUTO';
    const hasWebsite = !!(place.has_website && place.website);
    const reviewsCount = place.user_ratings_total || 0;
    const rating = place.rating || 5.0;
    const snippets = place.reviews_snippets || [];
    const socialAudit = place.social_audit || {};

    // Detect friction keywords in review snippets
    const foundKeywords = [];
    let matchingSnippet = null;

    for (const snippet of snippets) {
      const lower = snippet.toLowerCase();
      for (const kw of FRICTION_KEYWORDS) {
        if (lower.includes(kw)) {
          if (!foundKeywords.includes(kw)) foundKeywords.push(kw);
          if (!matchingSnippet) matchingSnippet = snippet;
        }
      }
    }

    // 1. Explicit Service Routing
    if (targetService === 'VAREGO') {
      const isDormant = socialAudit.social_dormant || (socialAudit.last_post_days_ago && socialAudit.last_post_days_ago >= 15);
      return {
        qualified: reviewsCount >= 3,
        route: 'RUTA_C_VAREGO',
        frictionKeywords: foundKeywords,
        frictionSnippet: socialAudit.audit_summary || (isDormant
          ? `Redes inactivas hace ${socialAudit.last_post_days_ago || 'varios'} días. Oportunidad para generar flujo continuo de clientes.`
          : `Negocio en crecimiento que requiere gestión profesional de contenido y Meta Ads para acelerar liquidez.`),
        rationale: 'Business qualified for VAREGO Social & Ads to scale customer acquisition and monthly liquidity ($100 USD/mo)'
      };
    }

    if (targetService === 'WEB') {
      // Prioritize Web Route A (No web) then Route B (Web redesign / conversion optimization)
      if (!hasWebsite) {
        return {
          qualified: true,
          route: 'RUTA_A',
          frictionKeywords: foundKeywords,
          frictionSnippet: matchingSnippet || 'El negocio carece de presencia digital directa para captar clientes.',
          rationale: 'Local establishment without verified online conversion channel'
        };
      } else {
        return {
          qualified: true,
          route: 'RUTA_B',
          frictionKeywords: foundKeywords,
          frictionSnippet: matchingSnippet || `Oportunidad de optimización de canal web y modernización digital (${rating}⭐).`,
          rationale: 'Active web presence with modernization and high-conversion UX opportunity'
        };
      }
    }

    // 2. AUTO Mode: Dual optimization (Web Directa + VAREGO Social)
    if (!hasWebsite) {
      return {
        qualified: true,
        route: 'RUTA_A',
        frictionKeywords: foundKeywords,
        frictionSnippet: matchingSnippet || 'El negocio carece de presencia web directa, dependiendo exclusivamente de tráfico presencial.',
        rationale: 'High local commercial demand without dedicated web conversion engine'
      };
    }

    if (socialAudit.social_dormant || !socialAudit.active_meta_ads) {
      return {
        qualified: true,
        route: 'RUTA_C_VAREGO',
        frictionKeywords: foundKeywords,
        frictionSnippet: socialAudit.audit_summary || `Oportunidad para generar liquidez y nuevos clientes diarios mediante gestión de redes y Meta Ads.`,
        rationale: 'Opportunity to accelerate cashflow and customer volume via VAREGO'
      };
    }

    return {
      qualified: true,
      route: 'RUTA_B',
      frictionKeywords: foundKeywords,
      frictionSnippet: matchingSnippet || `Modernización y optimización de conversión para canal web existente.`,
      rationale: 'Active digital presence ready for high-conversion overhaul'
    };

    return {
      qualified: false,
      route: null,
      frictionKeywords: [],
      frictionSnippet: null,
      rationale: 'Does not meet minimum volume or friction criteria'
    };
  }
}

module.exports = FrictionClassifier;
