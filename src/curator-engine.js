const countryRegistry = require('./utils/country-registry');

class CuratorEngine {
  detectTargetCountry(queryText) {
    return countryRegistry.findCountry(queryText);
  }

  validateAddressFormat(address, countryCode) {
    if (!address || address.length < 5) return false;
    const clean = address.toLowerCase();
    if (countryCode === '49') return clean.includes('straße') || clean.includes('str.') || clean.includes('platz') || clean.includes('weg') || /\d+/.test(clean);
    if (countryCode === '33') return clean.includes('rue') || clean.includes('avenue') || clean.includes('boulevard') || /\d+/.test(clean);
    if (countryCode === '57') return clean.includes('calle') || clean.includes('carrera') || clean.includes('diagonal') || clean.includes('transversal') || clean.includes('av') || /\d+/.test(clean);
    return clean.length >= 8;
  }

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

    if (place.name && place.name.trim().length >= 3) {
      checks.has_valid_name = true;
    } else {
      issues.push('Nombre de negocio inválido o demasiado corto');
    }

    if (phone) {
      if (phone.startsWith(targetCountry.code)) {
        checks.phone_prefix_valid = true;
        checks.geo_coherence_valid = true;
      } else {
        issues.push(`Incongruencia geográfica: Teléfono (+${phone}) no coincide con el prefijo +${targetCountry.code} de ${targetCountry.name}`);
      }
    } else {
      issues.push('Sin teléfono disponible para verificación');
    }

    if (this.validateAddressFormat(place.formatted_address, targetCountry.code)) {
      checks.has_verifiable_address = true;
    } else {
      issues.push('Dirección física no verificable o incompleta');
    }

    const cleanQuery = query.toLowerCase()
      .replace(/en\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+/i, '')
      .replace(/(alemania|colombia|españa|mexico|estados unidos|usa|guyana|francia)/gi, '')
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

      const aliases = {
        'panader': ['bäckerei', 'baeckerei', 'bakery', 'boulangerie', 'padaria', 'pan', 'pasteleria', 'konditorei', 'croissant'],
        'restauran': ['restaurant', 'gaststatte', 'bistro', 'comida', 'dining', 'brasserie'],
        'pizz': ['pizzeria', 'pizza'],
        'dental': ['zahnarzt', 'dentist', 'odontolog', 'dentaire'],
        'clinic': ['klinik', 'praxis', 'salud', 'medical', 'clinique'],
        'gastrobar': ['bar', 'pub', 'lounge', 'cocktail', 'kneipe', 'taverne'],
        'estetic': ['kosmetik', 'spa', 'beauty', 'estetica', 'salon', 'coiffure']
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
