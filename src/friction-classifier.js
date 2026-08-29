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
      // Prioritize Web Route A (No web) then Route B (Friction web)
      if (!hasWebsite && reviewsCount >= 3) {
        return {
          qualified: true,
          route: 'RUTA_A',
          frictionKeywords: foundKeywords,
          frictionSnippet: matchingSnippet || 'El negocio carece de presencia digital directa para ordenar.',
          rationale: 'Local demand without digital conversion channel'
        };
      }
      if (hasWebsite && (rating <= 3.9 || foundKeywords.length > 0)) {
        return {
          qualified: true,
          route: 'RUTA_B',
          frictionKeywords: foundKeywords,
          frictionSnippet: matchingSnippet || `Fallas en canal web actual reportadas por clientes (${rating} estrellas).`,
          rationale: 'Active web with verified user friction'
        };
      }
    }

    // 2. AUTO Mode: Coexistence of both Web Directa and VAREGO Social
    // If business has no web, Route A is a strong pain point
    if (!hasWebsite && reviewsCount >= 5 && targetService !== 'VAREGO') {
      return {
        qualified: true,
        route: 'RUTA_A',
        frictionKeywords: foundKeywords,
        frictionSnippet: matchingSnippet || 'El negocio carece de presencia digital directa, dependiendo de terceros.',
        rationale: 'High local demand without digital conversion channel'
      };
    }

    // If social channels are dormant or business needs customer acquisition / liquidity
    if (socialAudit.social_dormant || (reviewsCount >= 3 && !socialAudit.active_meta_ads)) {
      return {
        qualified: true,
        route: 'RUTA_C_VAREGO',
        frictionKeywords: foundKeywords,
        frictionSnippet: socialAudit.audit_summary || `Oportunidad para generar liquidez y nuevos clientes diarios mediante gestión de redes y Meta Ads.`,
        rationale: 'Opportunity to accelerate cashflow and customer volume via VAREGO'
      };
    }

    // Route B: Has website with customer friction
    if (hasWebsite && (rating <= 3.9 || foundKeywords.length > 0)) {
      return {
        qualified: true,
        route: 'RUTA_B',
        frictionKeywords: foundKeywords,
        frictionSnippet: matchingSnippet || `Calificación baja (${rating}) y fallas en canal digital detectadas.`,
        rationale: 'Active web presence with verified customer friction in reviews'
      };
    }

    // RUTA B: Has Website with Friction (Priority 2 / Reserve)
    if (hasWebsite && (rating <= 3.9 || foundKeywords.length > 0)) {
      return {
        qualified: true,
        route: 'RUTA_B',
        frictionKeywords: foundKeywords,
        frictionSnippet: matchingSnippet || `Calificación baja (${rating}) y fallas en canal digital detectadas.`,
        rationale: 'Active web presence with verified customer friction in reviews'
      };
    }

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
