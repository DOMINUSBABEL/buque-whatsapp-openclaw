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
  static classify(place) {
    const hasWebsite = !!(place.has_website && place.website);
    const reviewsCount = place.user_ratings_total || 0;
    const rating = place.rating || 5.0;
    const snippets = place.reviews_snippets || [];

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

    // RUTA A: No Website (Priority 1)
    if (!hasWebsite && reviewsCount >= 5) {
      return {
        qualified: true,
        route: 'RUTA_A',
        frictionKeywords: foundKeywords,
        frictionSnippet: matchingSnippet || 'El negocio carece de presencia digital directa, dependiendo de terceros.',
        rationale: 'High local demand without digital conversion channel'
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
