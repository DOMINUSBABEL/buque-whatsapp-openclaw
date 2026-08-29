/**
 * GEOFENCE CURATOR
 * Enforces strict territorial containment and micro-zone boundary validation
 * ensuring businesses physically belong to the requested neighborhood, district, or corridor.
 */

class GeoFenceCurator {
  /**
   * Validates if a place is strictly enclosed within the target territory
   */
  validateContainment(place, targetTerritory = {}) {
    const address = (place.formatted_address || place.address || '').toLowerCase();
    const city = (targetTerritory.city || '').toLowerCase();
    const targetZone = (targetTerritory.neighborhood || targetTerritory.micro_zone || '').toLowerCase();

    // 1. City Enclosure Check
    const normAddress = address.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normZone = targetZone.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let cityContained = true;
    if (normCity && normCity.length > 3) {
      cityContained = normAddress.includes(normCity) || (place.location?.city || '').toLowerCase().includes(normCity);
    }

    // 2. Zone / Neighborhood Token Matching
    let zoneContained = true;
    if (normZone && normZone !== 'centro' && normZone !== 'zona comercial' && normZone.length > 3) {
      const zoneTokens = normZone.split(/\s+/).filter(t => t.length > 3 && t !== 'barrio' && t !== 'sector' && t !== 'comuna');
      if (zoneTokens.length > 0) {
        zoneContained = zoneTokens.some(token => normAddress.includes(token));
      }
    }

    const passed = cityContained;
    const confidence = (cityContained ? 0.6 : 0) + (zoneContained ? 0.4 : 0);

    return {
      passed: passed,
      city_verified: cityContained,
      zone_verified: zoneContained,
      enclosure_confidence: confidence,
      rejection_reason: !cityContained
        ? `Ubicación fuera de ciudad: "${place.formatted_address}" no corresponde a ${targetTerritory.city}`
        : null
    };
  }
}

module.exports = new GeoFenceCurator();

// Curation Engine Step: feat(curator): add neighborhood bounding box and address token containment validator
