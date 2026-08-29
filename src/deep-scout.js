/**
 * DEEP SCOUT ENGINE (Multi-Layer Commercial Intelligence & Deep Neighborhood Scout)
 * Conducts exhaustive investigation of businesses in specific micro-zones/neighborhoods,
 * cross-referencing Chamber of Commerce registries, deep web forensics,
 * SWOT matrices, and business model decompositions.
 */
const scoutEngine = require('./scout-engine');
const registryInspector = require('./registry-inspector');
const deepWebForensics = require('./deep-web-forensics');
const swotAnalyzer = require('./swot-analyzer');
const businessModelEngine = require('./business-model-engine');
const dossierGenerator = require('./dossier-generator');

class DeepScoutEngine {
  /**
   * Executes deep investigation across all intelligence layers for a specific micro-zone
   */
  async conductDeepInvestigation(query, options = {}) {
    const limit = options.limit || 5;
    console.log(`\n🔍 [DEEP_SCOUT] Iniciando investigación comercial multi-capa para: "${query}"`);

    // 1. Extract Micro-Zone / Neighborhood / Barrio
    const barrioMatch = query.match(/(?:en\s+el\s+barrio|en\s+barrio|en\s+la\s+zona\s+de|en)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+)/i);
    const rawZone = barrioMatch ? barrioMatch[1].trim() : 'Zona Comercial';
    
    // Parse city & country
    const cityMatch = query.match(/(?:de|en)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?:,\s*|\s*-\s*)([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)?$/i);
    const city = cityMatch ? cityMatch[1].trim() : 'Medellín';
    const country = cityMatch && cityMatch[2] ? cityMatch[2].trim() : 'Colombia';

    // 2. Discover Candidate Businesses
    const places = await scoutEngine.searchPlaces(query, { limit, relaxedCuration: options.relaxedCuration });
    const fullReports = [];

    for (const place of places) {
      place.neighborhood = rawZone;
      place.city = city;
      place.country = country;

      // Layer A: Chamber of Commerce / Registry Inspection
      const registryData = await registryInspector.inspectBusiness(place.name, {
        city: city,
        neighborhood: rawZone,
        address: place.formatted_address,
        country: country
      }, place.category);

      // Layer B: Deep Web Forensics
      const forensicsData = await deepWebForensics.analyzeWebsite(place.website, place);

      // Layer C: SWOT (DAFO) Matrix
      const swotData = swotAnalyzer.generateSwot(place, registryData, forensicsData, place.social_audit || {});

      // Layer D: Business Model Decomposition
      const businessModelData = businessModelEngine.decomposeBusinessModel(place, swotData, registryData);

      // Layer E: Strategic Dossier Compilation
      const dossier = await dossierGenerator.generateDossier(place, registryData, forensicsData, swotData, businessModelData);

      const consolidatedReport = {
        business_name: place.name,
        category: place.category,
        location: {
          address: place.formatted_address,
          neighborhood: rawZone,
          city: city,
          country: country
        },
        contact: {
          phone_e164: place.formatted_phone_number,
          website: place.website
        },
        registry_verification: registryData,
        web_forensics: forensicsData,
        swot_matrix: swotData,
        business_model: businessModelData,
        dossier: dossier
      };

      fullReports.push(consolidatedReport);
      console.log(`  📊 [DEEP_SCOUT] Dossier completado: ${place.name} -> ${dossier.dossier_url}`);
    }

    return {
      query: query,
      micro_zone: rawZone,
      city: city,
      country: country,
      total_businesses_analyzed: fullReports.length,
      reports: fullReports
    };
  }
}

module.exports = new DeepScoutEngine();

// Step: feat(deepscout): integrate full pipeline orchestration from scout to dossier compilation

// Curation Engine Step: feat(deepscout): wire liveness probe and multi-source arbitration into deep investigation
