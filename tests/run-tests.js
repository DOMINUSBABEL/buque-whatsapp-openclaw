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

  // Summary
  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

executeTestSuite();
