/**
 * ALARICUS B2B AGENTIC SWARM (v2.0.0) - COMPREHENSIVE TEST SUITE
 * Validates Web Directa (Rutas A/B) + VAREGO Social & Ads (Ruta C),
 * Schema contracts, Social Auditor, Builder Engine, and QA Gatekeeper.
 */
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const LeadValidator = require('../src/schemas/lead-validator');
const frictionClassifier = require('../src/friction-classifier');
const diagnoserEngine = require('../src/diagnoser-engine');
const copyGenerator = require('../src/copy-generator');
const catalogBuilder = require('../src/catalog-builder');
const socialAuditor = require('../src/social-auditor');
const checkerQA = require('../src/checker-qa');
const leadDatabase = require('../src/lead-database');
const sessionManager = require('../src/session-manager');
const configManager = require('../src/config-manager');
const builderEngine = require('../src/builder-engine');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log('  \x1b[32m✅ PASS:\x1b[0m ' + name);
    passedTests++;
  } catch (err) {
    console.error('  \x1b[31m❌ FAIL:\x1b[0m ' + name);
    console.error('     ' + err.message);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log('  \x1b[32m✅ PASS:\x1b[0m ' + name);
    passedTests++;
  } catch (err) {
    console.error('  \x1b[31m❌ FAIL:\x1b[0m ' + name);
    console.error('     ' + err.message);
    failedTests++;
  }
}

async function executeTestSuite() {
  console.log('\n======================================================');
  console.log('   ⚔️  RUNNING ALARICUS & VAREGO VALIDATION SUITE     ');
  console.log('======================================================\n');

  // 1. Friction Classifier Tests (Web Directa + VAREGO)
  console.log('📦 [1/8] Testing Friction Classifier Dual-Pipeline...');
  runTest('Classifies Route A when no website and >= 3 reviews (Web mode)', () => {
    const place = { has_website: false, user_ratings_total: 10, rating: 4.8 };
    const res = frictionClassifier.classify(place, { targetService: 'WEB' });
    assert.strictEqual(res.qualified, true);
    assert.strictEqual(res.route, 'RUTA_A');
  });

  runTest('Classifies Route B when website exists and rating <= 3.9', () => {
    const place = { has_website: true, website: 'http://test.com', user_ratings_total: 30, rating: 3.7 };
    const res = frictionClassifier.classify(place, { targetService: 'WEB' });
    assert.strictEqual(res.qualified, true);
    assert.strictEqual(res.route, 'RUTA_B');
  });

  runTest('Classifies RUTA_C_VAREGO when targetService is VAREGO (>=3 reviews)', () => {
    const place = {
      name: 'Gastrobar El Refugio',
      user_ratings_total: 8,
      social_audit: { social_dormant: true, last_post_days_ago: 35 }
    };
    const res = frictionClassifier.classify(place, { targetService: 'VAREGO' });
    assert.strictEqual(res.qualified, true);
    assert.strictEqual(res.route, 'RUTA_C_VAREGO');
  });

  // 2. Social Auditor Module Tests
  console.log('\n📊 [2/8] Testing Social Auditor Subsystem...');
  await runAsyncTest('Audits Instagram dormancy and MRR expansion fit', async () => {
    const place = {
      name: 'Boutique & Moda Chic',
      category: 'Boutique',
      user_ratings_total: 22,
      social_last_post_days: 40
    };
    const audit = await socialAuditor.auditBusiness(place);
    assert.strictEqual(audit.social_dormant, true);
    assert.strictEqual(audit.last_post_days_ago, 40);
    assert.strictEqual(audit.estimated_mrr_fit, true);
  });

  // 3. Schema Validation Tests
  console.log('\n📐 [3/8] Testing Lead Swarm Schema Validator...');
  runTest('Validates complete compliant VAREGO lead object (RUTA_C_VAREGO)', () => {
    const sampleLead = {
      lead_id: 'lead_varego_123',
      company_name: 'Clínica Dental Estética',
      location: { city: 'Medellín', country: 'Colombia' },
      contact_channel: { primary_type: 'WHATSAPP', phone_e164: '+573001234567', instagram_handle: '@dentalestetica' },
      lead_route: 'RUTA_C_VAREGO',
      scout_metadata: {
        has_website: true,
        reviews_count: 35,
        rating: 4.8,
        social_audit: { instagram_handle: '@dentalestetica', social_dormant: true, last_post_days_ago: 32 }
      },
      diagnostics: { lead_score: 90, high_priority: true, core_pain_hook: 'Redes inactivas hace 32 días' },
      pipeline_status: 'SCOUTED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const result = LeadValidator.validate(sampleLead);
    assert.strictEqual(result.valid, true, 'Validation failed: ' + result.errors.join(', '));
  });

  // 4. Diagnoser & Score Engine Tests
  console.log('\n🧠 [4/8] Testing Diagnoser Engine for Web & VAREGO...');
  runTest('Computes high score and VAREGO service offer tag', () => {
    const lead = {
      company_name: 'Restaurante Central',
      lead_route: 'RUTA_C_VAREGO',
      scout_metadata: {
        reviews_count: 45,
        rating: 4.9,
        social_audit: { social_dormant: true, active_meta_ads: false, last_post_days_ago: 30 }
      },
      contact_channel: { phone_e164: '+573100000000' }
    };
    const diag = diagnoserEngine.diagnoseLead(lead);
    assert(diag.lead_score >= 80, 'Expected score >= 80, got ' + diag.lead_score);
    assert.strictEqual(diag.service_offer, 'VAREGO_SOCIAL_ADS');
    assert(diag.mrr_potential_usd >= 100);
  });

  // 5. Catalog & Ideas Builder Tests
  console.log('\n📋 [5/8] Testing Catalog Builder Extraction...');
  runTest('Extracts dishes and services from reviews for customized pitches', () => {
    const data = {
      category: 'Restaurante Gourmet',
      reviews_snippets: ['La mejor hamburguesa y sushi de la zona.'],
      phoneE164: '+573001112233'
    };
    const catalog = catalogBuilder.extractCatalog(data);
    assert(catalog.length >= 2);
  });

  // 6. Copy Generator Tests
  console.log('\n✍️ [6/8] Testing Copy Generator for Web Directa and VAREGO (/mo)...');
  runTest('Produces tailored copy for VAREGO with  USD rate clause', () => {
    const lead = {
      company_name: 'Gastrobar Terraza',
      lead_route: 'RUTA_C_VAREGO',
      location: { city: 'Medellín' },
      scout_metadata: { social_audit: { instagram_handle: '@terrazabar' } },
      assets: { landing_page_url: 'http://localhost:3000/demo/gastrobar-terraza' }
    };
    const copies = copyGenerator.generateCopies(lead);
    assert(copies.whatsapp.includes('VAREGO'));
    assert(copies.whatsapp.includes('100 USD'));
    assert(copies.email.subject.includes('VAREGO'));
  });

  // 7. QA Gatekeeper Tests
  console.log('\n🛡️ [7/8] Testing Checker QA Gatekeeper...');
  await runAsyncTest('Rejects VAREGO lead copy if missing pricing or agency token', async () => {
    const badLead = {
      company_name: 'Bar Test',
      lead_route: 'RUTA_C_VAREGO',
      contact_channel: { phone_e164: '+573001234567' },
      diagnostics: {
        channel_copies: {
          whatsapp: 'Hola, tenemos una oferta para tu negocio.', // Missing VAREGO and 100 USD
          email: { subject: 'Test', body: 'Test' }
        }
      },
      assets: { landing_page_url: 'http://localhost:3000/demo/test' }
    };
    const qa = await checkerQA.validateLead(badLead);
    assert.strictEqual(qa.passed, false);
    assert(qa.rejection_log.includes('pricing clause'));
  });

  // 9. Curator Truth Engine Tests
  console.log('\n🛡️ [9/11] Testing Curator & Data Integrity Engine...');
  const curatorEngine = require('../src/curator-engine');
  runTest('Detects target country and dialing code from query (Germany, Colombia, Guyana, France)', () => {
    const infoDE = curatorEngine.detectTargetCountry('Panaderías en Chemnitz - Alemania');
    assert.strictEqual(infoDE.code, '49');
    assert.strictEqual(infoDE.name, 'Alemania');

    const infoCO = curatorEngine.detectTargetCountry('Restaurantes en Medellín');
    assert.strictEqual(infoCO.code, '57');

    const infoGY = curatorEngine.detectTargetCountry('Bakeries in Georgetown - Guyana');
    assert.strictEqual(infoGY.code, '592');
    assert.strictEqual(infoGY.name, 'Guyana');

    const infoFR = curatorEngine.detectTargetCountry('Boulangeries en Paris - Francia');
    assert.strictEqual(infoFR.code, '33');
    assert.strictEqual(infoFR.name, 'Francia');

    const infoGF = curatorEngine.detectTargetCountry('Boulangerie en Cayenne - Guayana Francesa');
    assert.strictEqual(infoGF.code, '594');

    const infoSR = curatorEngine.detectTargetCountry('Bakeries in Paramaribo - Surinam');
    assert.strictEqual(infoSR.code, '597');
  });

  runTest('Rejects place with Colombian phone for Germany search query (Anti-Hallucination Gate)', () => {
    const invalidPlace = {
      name: 'Pizzería Napolitana',
      category: 'Pizzería',
      formatted_phone_number: '+573185566778', // Colombian phone
      formatted_address: 'Chemnitz, Alemania',
      reviews_snippets: ['Pizza deliciosa']
    };
    const curation = curatorEngine.curatePlace(invalidPlace, { query: 'Panaderías en Chemnitz - Alemania' });
    assert.strictEqual(curation.passed, false);
    assert(curation.rejection_reasons.some(r => r.includes('Incongruencia geográfica')));
  });

  runTest('Accepts verified Guyana business with +592 phone for Guyana query', () => {
    const validGuyanaPlace = {
      name: 'Georgetown Artisan Bakery',
      category: 'Bakery',
      formatted_phone_number: '+5922251234',
      formatted_address: 'Water Street, Georgetown, Guyana',
      reviews_snippets: ['Fresh bread daily']
    };
    const curation = curatorEngine.curatePlace(validGuyanaPlace, { query: 'Bakeries in Georgetown - Guyana' });
    assert.strictEqual(curation.passed, true);
    assert.strictEqual(curation.checks.phone_prefix_valid, true);
    assert.strictEqual(curation.expected_dialing_code, '+592');
  });

  runTest('Accepts verified German bakery with +49 phone for Germany query', () => {
    const validGermanPlace = {
      name: 'Bäckerei & Konditorei Schmidt Chemnitz',
      category: 'Bäckerei',
      formatted_phone_number: '+493714567890',
      formatted_address: 'Hauptstraße 12, Chemnitz, Deutschland',
      reviews_snippets: ['Frische Brötchen jeden Morgen']
    };
    const curation = curatorEngine.curatePlace(validGermanPlace, { query: 'Panaderías en Chemnitz - Alemania' });
    assert.strictEqual(curation.passed, true);
    assert.strictEqual(curation.checks.phone_prefix_valid, true);
  });

  // 10. Map Vision Scout Tests
  console.log('\n🗺️ [10/11] Testing Map Vision Scout...');
  const mapVisionScout = require('../src/map-vision-scout');
  await runAsyncTest('Analyzes screenshot filename and extracts zoned POI candidates', async () => {
    // Create a mock image file for testing
    const testImgPath = path.join(__dirname, '..', 'temp_map_chemnitz_test.png');
    fs.writeFileSync(testImgPath, 'MOCK_IMAGE_DATA');

    const mapRes = await mapVisionScout.analyzeMapImage(testImgPath);
    assert.strictEqual(mapRes.success, true);
    assert.strictEqual(mapRes.detected_location.city, 'Chemnitz');
    assert.strictEqual(mapRes.detected_location.country_dialing_code, '+49');
    assert(mapRes.extracted_business_pins.length >= 2);

    fs.unlinkSync(testImgPath);
  });

  // 11. Assistant Mode Tests
  console.log('\n🤝 [11/11] Testing Assistant Copilot Mode...');
  const assistantMode = require('../src/assistant-mode');
  runTest('Toggles between AUTO and ASSISTED mode', () => {
    const jid = '573117272822@s.whatsapp.net';
    assistantMode.setMode(jid, 'ASSISTED');
    let st = assistantMode.getOperatorState(jid);
    assert.strictEqual(st.mode, 'ASSISTED');
    assert.strictEqual(st.step, 'AWAITING_NICHE');

    assistantMode.setMode(jid, 'AUTO');
    st = assistantMode.getOperatorState(jid);
    assert.strictEqual(st.mode, 'AUTO');
  });

  // 12. Multi-Layer Intelligence Tests
  console.log('\n🏛️ [12/13] Testing Registry Inspector & Commercial Entity Verification...');
  const registryInspector = require('../src/registry-inspector');
  await runAsyncTest('Verifies legal entity and activity code for hardware store in Medellin', async () => {
    const reg = await registryInspector.inspectBusiness('Ferretería El Tornillo de Oro', {
      city: 'Medellín',
      neighborhood: 'La Milagrosa',
      country_iso: 'CO'
    }, 'Ferretería');
    assert.strictEqual(reg.verified, true);
    assert.strictEqual(reg.legal_data.activity_code, '4752');
    assert(reg.registry_source.includes('Cámara de Comercio'));
    assert(reg.establishment_data.neighborhood.includes('La Milagrosa'));
  });

  console.log('\n⚡ [13/14] Testing Deep Web Forensics & Digital Vacancy Diagnostic...');
  const deepWebForensics = require('../src/deep-web-forensics');
  await runAsyncTest('Detects digital vacancy when business lacks official website', async () => {
    const forensics = await deepWebForensics.analyzeWebsite(null);
    assert.strictEqual(forensics.has_website, false);
    assert.strictEqual(forensics.status, 'DIGITAL_VACANCY');
    assert.strictEqual(forensics.conversion_friction_index, 95);
  });

  console.log('\n🎯 [14/15] Testing SWOT Matrix & Business Model Engine...');
  const swotAnalyzer = require('../src/swot-analyzer');
  const businessModelEngine = require('../src/business-model-engine');
  runTest('Generates comprehensive 4-quadrant SWOT matrix and localized density score', () => {
    const biz = { name: 'Ferretería La Milagrosa', city: 'Medellín', neighborhood: 'La Milagrosa', category: 'Ferretería', user_ratings_total: 28, rating: 4.6 };
    const reg = { verified: true, registry_source: 'Cámara de Comercio de Medellín', legal_data: { years_in_business: 8 } };
    const forensics = { has_website: false, status: 'DIGITAL_VACANCY', conversion_friction_index: 95 };
    const swot = swotAnalyzer.generateSwot(biz, reg, forensics, {});
    assert.strictEqual(swot.matrix.strengths.length >= 3, true);
    assert.strictEqual(swot.matrix.weaknesses.length >= 1, true);
    assert.strictEqual(swot.matrix.opportunities.length >= 2, true);

    const bModel = businessModelEngine.decomposeBusinessModel(biz, swot, reg);
    assert.strictEqual(bModel.archetype.includes('Suministros y Herramientas'), true);
    assert(bModel.neighborhood_landscape.competitive_density_score > 0);
  });

  console.log('\n🎨 [15/17] Testing Theme Engine Luxury Aesthetics across 10 Sectors...');
  const themeEngine = require('../src/theme-engine');
  runTest('Assigns bespoke luxury themes for Industrial, Automotive, Bakery, Dental, Spa, and Tech', () => {
    const thInd = themeEngine.resolveTheme('Ferretería');
    assert.strictEqual(thInd.key, 'HARDWARE_INDUSTRIAL');
    assert.strictEqual(thInd.accent_primary, '#f59e0b');

    const thAuto = themeEngine.resolveTheme('Taller Mecánico Detailing');
    assert.strictEqual(thAuto.key, 'AUTOMOTIVE_DETAILING');
    assert.strictEqual(thAuto.accent_primary, '#ef4444');

    const thBake = themeEngine.resolveTheme('Panadería Artesanal y Café');
    assert.strictEqual(thBake.key, 'ARTISAN_BAKERY');
    assert.strictEqual(thBake.accent_primary, '#d97706');

    const thDent = themeEngine.resolveTheme('Clínica Odontológica');
    assert.strictEqual(thDent.key, 'MEDICAL_DENTAL');
    assert.strictEqual(thDent.accent_primary, '#38bdf8');

    const thSpa = themeEngine.resolveTheme('Centro de Estética & Spa');
    assert.strictEqual(thSpa.key, 'AESTHETIC_SPA');
    assert.strictEqual(thSpa.accent_primary, '#f43f5e');

    const thTech = themeEngine.resolveTheme('Agencia de Software e IA');
    assert.strictEqual(thTech.key, 'TECH_AUTOMATION');
    assert.strictEqual(thTech.accent_primary, '#6366f1');
  });

  await runAsyncTest('Builder Engine compiles interactive landing page with WhatsApp Cart & ROI Slider', async () => {
    const builderEngine = require('../src/builder-engine');
    const mockLead = {
      lead_id: 'test-cart-lead-001',
      company_name: 'Taller Mecánico Los Andes',
      lead_route: 'RUTA_A',
      location: { city: 'Pereira', address: 'Av 30 de Agosto #40-10' },
      contact_channel: { phone_e164: '+573110000000' },
      scout_metadata: {
        category: 'Taller Mecánico',
        rating: 4.9,
        reviews_count: 35,
        reviews_snippets: ['Excelente cambio de aceite y frenos']
      }
    };
    const landingUrl = await builderEngine.buildLandingPage(mockLead);
    assert(landingUrl.includes('/demo/'));

    const fs = require('fs');
    const path = require('path');
    const generatedHtml = fs.readFileSync(path.join(__dirname, '..', 'generated_sites', 'taller-mecanico-los-andes-test-c', 'index.html'), 'utf8');
    assert(generatedHtml.includes('addToCart'));
    assert(generatedHtml.includes('orders-slider'));
    assert(generatedHtml.includes('Taller Mecánico Los Andes'));
  });

  console.log('\n🧭 [16/16] Testing Subscout Specialized Swarm & Multi-Service Adapter...');
  const geoTerritorySubscout = require('../src/subscouts/geo-territory-subscout');
  const commercialServiceAdapter = require('../src/subscouts/commercial-service-adapter');
  const subscoutCoordinator = require('../src/subscouts/subscout-coordinator');

  runTest('Resolves La Milagrosa neighborhood to Comuna 9 in Medellin', () => {
    const terr = geoTerritorySubscout.resolveTerritory('Ferreterías en el barrio La Milagrosa de Medellín');
    assert.strictEqual(terr.neighborhood, 'La milagrosa');
    assert.strictEqual(terr.city, 'Medellín');
    assert.strictEqual(terr.country_iso, 'CO');
  });

  runTest('Adapts diagnostic to AI_AUTOMATION and ERP_POS_SOFTWARE services', () => {
    const diagAI = commercialServiceAdapter.adaptServiceDiagnostic('AI_AUTOMATION', { name: 'Clínica Dental' }, {});
    assert.strictEqual(diagAI.service_key, 'AI_AUTOMATION');
    assert.strictEqual(diagAI.base_fee_usd, 150);

    const diagPOS = commercialServiceAdapter.adaptServiceDiagnostic('ERP_POS_SOFTWARE', { name: 'Ferretería Central' }, {});
    assert.strictEqual(diagPOS.service_key, 'ERP_POS_SOFTWARE');
    assert.strictEqual(diagPOS.base_fee_usd, 80);
  });

  await runAsyncTest('Executes full Subscout Swarm for arbitrary micro-zone and service', async () => {
    const swarmRes = await subscoutCoordinator.executeSubscoutSwarm('Ferreterías en el barrio La Milagrosa de Medellín', {
      serviceOffer: 'AI_AUTOMATION',
      limit: 2
    });
    assert.strictEqual(swarmRes.total_scouted >= 1, true);
    assert.strictEqual(swarmRes.target_service, 'AI_AUTOMATION');
    assert.strictEqual(swarmRes.results[0].institutional_verification.official_registry_board.includes('Cámara'), true);
  });

  console.log('\n🛡️ [17/17] Testing 5 Advanced Curation Engines (Deduplication, Geofence, Liveness, Arbitration, Provenance)...');
  const entityDeduplicator = require('../src/curator/entity-deduplicator');
  const sourceArbitrator = require('../src/curator/source-arbitrator');
  const geofenceCurator = require('../src/curator/geofence-curator');
  const livenessProbe = require('../src/curator/liveness-probe');
  const dataProvenanceLedger = require('../src/curator/data-provenance-ledger');

  runTest('Deduplicates fuzzy business names (Auto Taller El Paisa SAS vs Taller El Paisa)', () => {
    const rawPlaces = [
      { name: 'Auto Taller El Paisa S.A.S.', formatted_phone_number: '+573110000000', user_ratings_total: 15 },
      { name: 'Taller El Paisa', formatted_phone_number: '+573110000000', user_ratings_total: 25 },
      { name: 'Mecánica Rápida Los Álamos', formatted_phone_number: '+573129999999', user_ratings_total: 8 }
    ];
    const deduped = entityDeduplicator.deduplicatePlaces(rawPlaces);
    assert.strictEqual(deduped.length, 2);
    assert.strictEqual(deduped[0].reviews_count, 25);
  });

  runTest('Arbitrates multi-source conflicts with weighted field-level reliability', () => {
    const arb = sourceArbitrator.arbitrate({
      mapsData: { name: 'Taller Paisa', formatted_phone_number: '+573117272822', formatted_address: 'Av 30 de Agosto #15-20, Pereira' },
      registryData: { verified: true, legal_data: { trade_name: 'Auto Taller El Paisa S.A.S.' } },
      socialData: { whatsapp_phone: '+573117272822' }
    });
    assert.strictEqual(arb.canonical_profile.name, 'Auto Taller El Paisa S.A.S.');
    assert.strictEqual(arb.canonical_profile.phone_e164, '+573117272822');
    assert(arb.arbitration_confidence.overall_truth_weight >= 0.85);
  });

  runTest('GeoFence validates city and neighborhood enclosure', () => {
    const valid = geofenceCurator.validateContainment(
      { formatted_address: 'Calle 21 #15-40, Barrio Turín, Pereira, Risaralda' },
      { city: 'Pereira', neighborhood: 'Turín' }
    );
    assert.strictEqual(valid.passed, true);
    assert.strictEqual(valid.city_verified, true);
  });

  runTest('Liveness probe evaluates operational status and review volume', () => {
    const live = livenessProbe.evaluateRecency({ business_status: 'OPERATIONAL', user_ratings_total: 20, rating: 4.8 });
    assert.strictEqual(live.is_operational, true);
    assert(live.liveness_score >= 0.9);

    const dead = livenessProbe.evaluateRecency({ business_status: 'CLOSED_PERMANENTLY' });
    assert.strictEqual(dead.is_operational, false);
  });

  runTest('Data Provenance Ledger compiles cryptographic truth seal and composite score', () => {
    const prov = dataProvenanceLedger.compileLedger(
      { name: 'Taller Mecánico Central', formatted_phone_number: '+573001234567', formatted_address: 'Carrera 8 #20-15, Pereira' },
      { verified: true, legal_data: { legal_status: 'MATRICULADO_ACTIVO', activity_code: '4520' } },
      { has_website: true, cms: 'WordPress' },
      { is_registered_on_whatsapp: true, confidence: 0.95 }
    );
    assert(prov.truth_score >= 85);
    assert.strictEqual(prov.quality_gate_passed, true);
    assert(prov.provenance_seal.signature.startsWith('TRUTH-SEAL-'));
  });

  console.log('\n📱 [18/18] Testing Multi-Number Inbound Routing with Bang (!) Commands...');
  const { handleIncomingMessage } = require('../src/alaricus-bot');

  await runAsyncTest('Executes ! command when sent by an external non-admin number', async () => {
    let sentMessage = null;
    const mockSock = {
      sendMessage: async (jid, payload) => {
        sentMessage = { jid, payload };
      }
    };

    const mockMsg = {
      key: {
        remoteJid: '573009998877@s.whatsapp.net',
        fromMe: false
      },
      message: {
        conversation: '!ayuda'
      }
    };

    await handleIncomingMessage(mockSock, mockMsg);
    assert(sentMessage !== null);
    assert.strictEqual(sentMessage.jid, '573009998877@s.whatsapp.net');
    assert(sentMessage.payload.text.includes('COMANDOS DE ADMINISTRACIÓN ALARICUS'));
  });

  await runAsyncTest('Runs 3-step assisted copilot wizard end-to-end without help message interference and detects Colombia +57', async () => {
    let sentMessages = [];
    const mockSock = {
      sendMessage: async (jid, payload) => {
        sentMessages.push(payload.text);
      }
    };
    const testJid = '573123456789@s.whatsapp.net';

    // 1. !asistido
    await handleIncomingMessage(mockSock, {
      key: { remoteJid: testJid, fromMe: false },
      message: { conversation: '!asistido' }
    });
    assert(sentMessages[sentMessages.length - 1].includes('Paso 1/3'));

    // 2. Send Niche (Talleres Mecánicos)
    await handleIncomingMessage(mockSock, {
      key: { remoteJid: testJid, fromMe: false },
      message: { conversation: 'Talleres Mecánicos' }
    });
    assert(sentMessages[sentMessages.length - 1].includes('Paso 2/3'));
    assert(sentMessages[sentMessages.length - 1].includes('Talleres Mecánicos'));

    // 3. Send Location (Medellín - Colombia)
    await handleIncomingMessage(mockSock, {
      key: { remoteJid: testJid, fromMe: false },
      message: { conversation: 'Medellín - Colombia' }
    });
    // 4. Send Service (1 - Web Directa)
    await handleIncomingMessage(mockSock, {
      key: { remoteJid: testJid, fromMe: false },
      message: { conversation: '1' }
    });
    const lastSummaryMsg = sentMessages[sentMessages.length - 1];
    assert(lastSummaryMsg.includes('PROSPECTOS CURADOS LISTOS PARA REVISIÓN'));
    assert(lastSummaryMsg.includes('!aprobar-todos'));
  });

  await runAsyncTest('ScoutEngine and SwarmOrchestrator discovery for "Talleres Mecánicos. en Medellín - Colombia"', async () => {
    const scout = require('../src/scout-engine');
    const swarm = require('../src/swarm-orchestrator');

    const places = await scout.searchPlaces('Talleres Mecánicos. en Medellín - Colombia', { limit: 3 });
    assert(places.length >= 1);
    assert.strictEqual(places[0].country, 'Colombia');

    const batch = await swarm.runScanBatch('Talleres Mecánicos. en Medellín - Colombia', { limit: 2, targetService: 'WEB' });
    assert(batch.length >= 1);
    assert.strictEqual(batch[0].location.country, 'Colombia');
  });

  // Summary
  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

executeTestSuite();
