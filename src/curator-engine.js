/**
 * CURATOR ENGINE (Truth & Data Integrity Verification Agent)
 * Verifies the veracity, geographic coherence, phone country prefix,
 * and niche relevance of discovered places before asset generation or outreach.
 */

const COUNTRY_DIALING_CODES = {
  'alemania': { code: '49', name: 'Alemania', iso: 'DE', keywords: ['chemnitz', 'berlin', 'munich', 'hamburg', 'frankfurt', 'germany', 'deutschland'] },
  'colombia': { code: '57', name: 'Colombia', iso: 'CO', keywords: ['medellin', 'bogota', 'cali', 'barranquilla', 'cartagena', 'bucaramanga', 'pereira'] },
  'estados unidos': { code: '1', name: 'Estados Unidos', iso: 'US', keywords: ['usa', 'united states', 'miami', 'new york', 'orlando', 'houston', 'los angeles'] },
  'españa': { code: '34', name: 'España', iso: 'ES', keywords: ['madrid', 'barcelona', 'valencia', 'sevilla', 'spain'] },
  'mexico': { code: '52', name: 'México', iso: 'MX', keywords: ['cdmx', 'guadalajara', 'monterrey', 'cancun', 'puebla'] },
  'peru': { code: '51', name: 'Perú', iso: 'PE', keywords: ['lima', 'arequipa', 'cusco', 'trujillo'] },
  'chile': { code: '56', name: 'Chile', iso: 'CL', keywords: ['santiago', 'valparaiso', 'concepcion'] },
  'argentina': { code: '54', name: 'Argentina', iso: 'AR', keywords: ['buenos aires', 'cordoba', 'rosario', 'mendoza'] }
};

class CuratorEngine {
  /**
   * Detects the target country and dialing code from a query or location text
   */
  detectTargetCountry(queryText) {
    const text = (queryText || '').toLowerCase();

    for (const [countryKey, info] of Object.entries(COUNTRY_DIALING_CODES)) {
      if (text.includes(countryKey)) return info;
      for (const kw of info.keywords) {
        if (text.includes(kw)) return info;
      }
    }

    return COUNTRY_DIALING_CODES['colombia']; // Default fallback if no country specified
  }

  /**
   * Curates and validates a discovered place against search query criteria
   */
  curatePlace(place, searchContext = {}) {
    const query = searchContext.query || '';
    const targetCountry = searchContext.targetCountry || this.detectTargetCountry(query);
    const phone = (place.formatted_phone_number || '').replace(/[^0-9]/g, '');

    const checks = {
      has_valid_name: false,
      niche_relevance_valid: false,
      geo_coherence_valid: false,
      phone_prefix_valid: false,
      has_verifiable_address: false
    };

    const issues = [];

    // 1. Name Check
    if (place.name && place.name.trim().length >= 3) {
      checks.has_valid_name = true;
    } else {
      issues.push('Nombre de negocio inválido o demasiado corto');
    }

    // 2. Geographic & Country Phone Prefix Check
    if (phone) {
      if (phone.startsWith(targetCountry.code)) {
        checks.phone_prefix_valid = true;
        checks.geo_coherence_valid = true;
      } else {
        issues.push(`Incongruencia geográfica: Teléfono (${phone}) no coincide con el prefijo +${targetCountry.code} de ${targetCountry.name}`);
      }
    } else {
      issues.push('Sin teléfono disponible para verificación');
    }

    // Address verification
    const address = (place.formatted_address || '').toLowerCase();
    if (address.length > 5) {
      checks.has_verifiable_address = true;
    } else {
      issues.push('Dirección física no verificable');
    }

    // 3. Niche / Category Semantic Coherence Check
    const cleanQuery = query.toLowerCase()
      .replace(/en\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+/i, '')
      .replace(/(alemania|colombia|españa|mexico|estados unidos|usa)/gi, '')
      .trim();

    const placeName = (place.name || '').toLowerCase();
    const placeCat = (place.category || '').toLowerCase();
    const snippets = (place.reviews_snippets || []).join(' ').toLowerCase();

    const queryTokens = cleanQuery.split(/\s+/).filter(w => w.length > 3);

    if (queryTokens.length === 0) {
      checks.niche_relevance_valid = true;
    } else {
      const matchInName = queryTokens.some(token => placeName.includes(token));
      const matchInCat = queryTokens.some(token => placeCat.includes(token));
      const matchInSnippets = queryTokens.some(token => snippets.includes(token));

      // Multilingual aliases (e.g. panadería <-> bäckerei / bakery)
      const aliases = {
        'panader': ['bäckerei', 'baeckerei', 'bakery', 'pan', 'pasteleria', 'konditorei', 'croissant'],
        'restauran': ['restaurant', 'gaststatte', 'bistro', 'comida', 'dining'],
        'pizz': ['pizzeria', 'pizza'],
        'dental': ['zahnarzt', 'dentist', 'odontolog'],
        'clinic': ['klinik', 'praxis', 'salud', 'medical'],
        'gastrobar': ['bar', 'pub', 'lounge', 'cocktail', 'kneipe'],
        'estetic': ['kosmetik', 'spa', 'beauty', 'estetica', 'salon']
      };

      let aliasMatch = false;
      for (const [key, aliasList] of Object.entries(aliases)) {
        if (cleanQuery.includes(key)) {
          aliasMatch = aliasList.some(a => placeName.includes(a) || placeCat.includes(a) || snippets.includes(a));
        }
      }

      if (matchInName || matchInCat || matchInSnippets || aliasMatch) {
        checks.niche_relevance_valid = true;
      } else {
        issues.push(`Incongruencia de nicho: El negocio "${place.name}" (${place.category}) no corresponde al nicho buscado "${cleanQuery}"`);
      }
    }

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const truthScore = Math.round((passedChecks / Object.keys(checks).length) * 100);
    const passed = checks.has_valid_name && checks.niche_relevance_valid && checks.phone_prefix_valid;

    return {
      passed,
      truth_score: truthScore,
      target_country: targetCountry.name,
      expected_dialing_code: `+${targetCountry.code}`,
      checks,
      rejection_reasons: issues
    };
  }
}

module.exports = new CuratorEngine();
