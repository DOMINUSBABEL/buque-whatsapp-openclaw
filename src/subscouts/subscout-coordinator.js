/**
 * SUBSCOUT COORDINATOR
 * Orchestrates the specialized subscout swarm to execute multi-layer intelligence discovery
 * across any country, territory, and commercial service offer.
 */
const geoTerritorySubscout = require('./geo-territory-subscout');
const institutionalRegistrySubscout = require('./institutional-registry-subscout');
const publicDirectorySubscout = require('./public-directory-subscout');
const commercialServiceAdapter = require('./commercial-service-adapter');
const deepWebForensics = require('../deep-web-forensics');
const swotAnalyzer = require('../swot-analyzer');
const businessModelEngine = require('../business-model-engine');
const dossierGenerator = require('../dossier-generator');
const scoutEngine = require('../scout-engine');

class SubscoutCoordinator {
  /**
   * Executes full swarm scouting pipeline for any query and any target service
   */
  async executeSubscoutSwarm(query, options = {}) {
    const targetService = options.serviceOffer || 'DIRECT_WEB';
    const limit = options.limit || 5;

    console.log(`\n========================================================================`);
    console.log(`🧭 [SUBSCOUT_SWARM] Desplegando Enjambre de Subscouts para: "${query}"`);
    console.log(`💼 Oferta Comercial Seleccionada: [${targetService}]`);
    console.log(`========================================================================`);

    // 1. Resolve Geographic & Territorial Tree
    const territory = geoTerritorySubscout.resolveTerritory(query);
    console.log(`📍 [GeoTerritorySubscout] Territorio: ${territory.neighborhood} | ${territory.district_or_comuna} | ${territory.city}, ${territory.country} (${territory.country_iso} ${territory.dialing_code})`);

    // 2. Query Public Directories & Registries
    await publicDirectorySubscout.discoverListings(territory, query);

    // 3. Discover Candidate Places via Scout Engine
    const places = await scoutEngine.searchPlaces(query, { limit });
    const enrichedResults = [];

    for (const place of places) {
      place.neighborhood = territory.neighborhood;
      place.city = territory.city;
      place.country = territory.country;

      // 4. Institutional Verification Subscout
      const registryData = await institutionalRegistrySubscout.verifyCorporateEntity(place.name, territory, place.category);

      // 5. Deep Web Forensics Subscout
      const forensicsData = await deepWebForensics.analyzeWebsite(place.website, place);

      // 6. Service Offer Adaptation Subscout
      const serviceDiagnostic = commercialServiceAdapter.adaptServiceDiagnostic(targetService, place, forensicsData, place.social_audit, registryData);

      // 7. SWOT Strategic Matrix
      const swotData = swotAnalyzer.generateSwot(place, {
        verified: true,
        registry_source: registryData.official_registry_board,
        legal_data: registryData.corporate_identification
      }, forensicsData, place.social_audit || {});

      // 8. Business Model Decomposition
      const businessModelData = businessModelEngine.decomposeBusinessModel(place, swotData, registryData);

      // 9. Compile Comprehensive Dossier
      const dossier = await dossierGenerator.generateDossier(place, {
        registry_source: registryData.official_registry_board,
        compliance_seal: { commercial_standing: 'VERIFICADO_EN_REGISTRO' },
        legal_data: registryData.corporate_identification
      }, forensicsData, swotData, businessModelData);

      enrichedResults.push({
        business_name: place.name,
        category: place.category,
        territory: territory,
        phone_e164: place.formatted_phone_number,
        institutional_verification: registryData,
        web_forensics: forensicsData,
        service_diagnostic: serviceDiagnostic,
        swot_matrix: swotData,
        business_model: businessModelData,
        dossier: dossier
      });
    }

    return {
      query,
      territory,
      target_service: targetService,
      total_scouted: enrichedResults.length,
      results: enrichedResults
    };
  }
}

module.exports = new SubscoutCoordinator();
