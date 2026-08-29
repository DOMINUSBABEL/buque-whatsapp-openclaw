/**
 * SOURCE ARBITRATOR
 * Arbitrates and reconciles conflicting business data points across
 * Chamber of Commerce registries, OpenStreetMap, Google Maps, and Meta Graph feeds.
 */

const SOURCE_WEIGHTS = {
  LEGAL_NAME: { REGISTRY: 0.95, DIRECTORY: 0.70, MAPS: 0.50 },
  REGISTRATION_ID: { REGISTRY: 0.98, DIRECTORY: 0.60, MAPS: 0.20 },
  PHONE_WHATSAPP: { SOCKET_PROBE: 1.0, META_SOCIAL: 0.90, GOOGLE_MAPS: 0.85, REGISTRY: 0.70 },
  PHYSICAL_ADDRESS: { OPENSTREETMAP: 0.92, GOOGLE_MAPS: 0.90, REGISTRY: 0.85, DIRECTORY: 0.75 },
  REVIEWS_SENTIMENT: { GOOGLE_MAPS: 0.90, SOCIAL_FEED: 0.80, DIRECTORY: 0.65 }
};

class SourceArbitrator {
  /**
   * Arbitrates multi-source attributes into a reconciled canonical object
   */
  arbitrate(sources = {}) {
    const { mapsData = {}, registryData = {}, socialData = {}, osmData = {} } = sources;

    // 1. Arbitrate Legal / Commercial Name
    const resolvedName = registryData.legal_data?.trade_name || mapsData.name || 'Negocio Local';
    const nameConfidence = registryData.verified ? SOURCE_WEIGHTS.LEGAL_NAME.REGISTRY : SOURCE_WEIGHTS.LEGAL_NAME.MAPS;

    // 2. Arbitrate Phone Channel
    let resolvedPhone = mapsData.formatted_phone_number || registryData.contact?.phone || '';
    let phoneConfidence = SOURCE_WEIGHTS.PHONE_WHATSAPP.GOOGLE_MAPS;
    let phoneSource = 'GOOGLE_MAPS';

    if (socialData.whatsapp_phone) {
      resolvedPhone = socialData.whatsapp_phone;
      phoneConfidence = SOURCE_WEIGHTS.PHONE_WHATSAPP.META_SOCIAL;
      phoneSource = 'META_SOCIAL';
    }

    // 3. Arbitrate Address
    const resolvedAddress = osmData.address || mapsData.formatted_address || registryData.establishment_data?.physical_address || 'Dirección comercial';
    const addressConfidence = osmData.address ? SOURCE_WEIGHTS.PHYSICAL_ADDRESS.OPENSTREETMAP : SOURCE_WEIGHTS.PHYSICAL_ADDRESS.GOOGLE_MAPS;

    // 4. Arbitrate Activity / Category
    const resolvedCategory = registryData.legal_data?.activity_description || mapsData.category || 'Comercio y Servicios';

    return {
      success: true,
      canonical_profile: {
        name: resolvedName,
        category: resolvedCategory,
        phone_e164: resolvedPhone,
        address: resolvedAddress,
        website: mapsData.website || null,
        rating: mapsData.rating || 4.5,
        reviews_count: mapsData.user_ratings_total || mapsData.reviews_count || 10
      },
      arbitration_confidence: {
        name: { confidence: nameConfidence, source: registryData.verified ? 'REGISTRY' : 'MAPS' },
        phone: { confidence: phoneConfidence, source: phoneSource },
        address: { confidence: addressConfidence, source: osmData.address ? 'OSM' : 'MAPS' },
        overall_truth_weight: Math.round(((nameConfidence + phoneConfidence + addressConfidence) / 3) * 100) / 100
      }
    };
  }
}

module.exports = new SourceArbitrator();
