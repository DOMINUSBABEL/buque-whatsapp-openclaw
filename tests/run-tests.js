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

  // 8. Builder Engine Tests (Web Directa + VAREGO Proposal)
  console.log('\n🏗️ [8/8] Testing Landing Page Builders (Web & VAREGO)...');
  await runAsyncTest('Compiles VAREGO proposal page into generated_sites', async () => {
    const testVaregoLead = {
      lead_id: 'lead_varego_001',
      company_name: 'Estética Bella Sonrisa',
      lead_route: 'RUTA_C_VAREGO',
      location: { city: 'Bogotá', address: 'Calle 100 #15-20' },
      scout_metadata: {
        category: 'Estética',
        rating: 4.8,
        reviews_count: 20,
        social_audit: { instagram_handle: '@bellasonrisa', last_post_days_ago: 28 }
      },
      contact_channel: { phone_e164: '+573115554433' }
    };
    const url = await builderEngine.buildLandingPage(testVaregoLead);
    assert(url.includes('/demo/'));
    const slug = url.split('/demo/')[1];
    const htmlPath = path.join(__dirname, '..', 'generated_sites', slug, 'index.html');
    assert(fs.existsSync(htmlPath), 'Expected file at ' + htmlPath);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    assert(htmlContent.includes('VAREGO'), 'Generated page must include VAREGO branding');
    assert(htmlContent.includes(''), 'Generated page must include  price');
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
