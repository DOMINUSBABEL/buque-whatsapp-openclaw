/**
 * SWARM ORCHESTRATOR
 * Central coordinator of the 6 specialized agents:
 * 1. Scout Agent (Discovery & Extraction)
 * 2. Friction Classifier (Route A / Route B)
 * 3. Diagnoser Agent (Scoring & Multi-Channel Copywriting)
 * 4. Builder Agent (Custom Mobile Landing Page)
 * 5. Filmer Agent (10s Vertical Micro-Demo Video)
 * 6. Checker Agent (QA Gatekeeper)
 */
const { randomUUID } = require('crypto');
const scoutEngine = require('./scout-engine');
const frictionClassifier = require('./friction-classifier');
const diagnoserEngine = require('./diagnoser-engine');
const copyGenerator = require('./copy-generator');
const builderEngine = require('./builder-engine');
const filmerEngine = require('./filmer-engine');
const checkerQA = require('./checker-qa');
const leadDatabase = require('./lead-database');
const LeadValidator = require('./schemas/lead-validator');

class SwarmOrchestrator {
  constructor() {
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
    console.log('[SwarmOrchestrator] ⏸️ Pipeline paused by operator.');
  }

  resume() {
    this.isPaused = false;
    console.log('[SwarmOrchestrator] ▶️ Pipeline resumed by operator.');
  }

  /**
   * Executes an autonomous scan and build batch based on query
   */
  async runScanBatch(query, options = {}, progressCallback = null) {
    const limit = options.limit || 15;
    console.log(`[SwarmOrchestrator] 🚀 Starting Swarm Batch for: "${query}" (Target: ${limit} qualified leads)`);

    // 1. SCOUT AGENT
    const rawPlaces = await scoutEngine.searchPlaces(query, { limit: limit * 2 });
    const qualifiedLeads = [];

    for (const place of rawPlaces) {
      if (this.isPaused) break;

      // 2. CLASSIFIER AGENT
      const classification = frictionClassifier.classify(place, options);
      if (!classification.qualified) continue;

      const leadId = place.place_id ? `lead_${place.place_id.slice(0, 12)}` : `lead_${Date.now()}`;
      
      const leadPayload = {
        lead_id: leadId,
        company_name: place.name,
        location: {
          address: place.formatted_address,
          city: place.city,
          country: place.country,
          maps_place_id: place.place_id
        },
        contact_channel: {
          primary_type: 'WHATSAPP',
          phone_e164: place.formatted_phone_number || '+573000000000',
          email: null,
          instagram_handle: place.social_audit?.instagram_handle || null
        },
        lead_route: classification.route,
        scout_metadata: {
          has_website: place.has_website,
          website_url: place.website,
          reviews_count: place.user_ratings_total,
          rating: place.rating,
          category: place.category,
          friction_keywords_found: classification.frictionKeywords,
          friction_snippet: classification.frictionSnippet,
          social_audit: place.social_audit || null
        },
        pipeline_status: 'SCOUTED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check duplicates
      if (leadDatabase.isDuplicate(leadPayload.contact_channel.phone_e164, leadPayload.location.maps_place_id)) {
        continue;
      }

      // 3. DIAGNOSER AGENT
      const diag = diagnoserEngine.diagnoseLead(leadPayload);
      leadPayload.diagnostics = diag;
      leadPayload.pipeline_status = 'DIAGNOSED';

      // 4. COPY GENERATOR
      leadPayload.diagnostics.channel_copies = copyGenerator.generateCopies(leadPayload);

      qualifiedLeads.push(leadPayload);
      if (qualifiedLeads.length >= limit) break;
    }

    // Sort by lead score and assign high priority for top leads
    qualifiedLeads.sort((a, b) => (b.diagnostics?.lead_score || 0) - (a.diagnostics?.lead_score || 0));
    const highPriorityCount = Math.min(qualifiedLeads.length, 5);
    for (let i = 0; i < highPriorityCount; i++) {
      qualifiedLeads[i].diagnostics.high_priority = true;
    }

    const processedBatch = [];

    for (const lead of qualifiedLeads) {
      if (this.isPaused) break;

      // 5. BUILDER AGENT: Generate landing page
      try {
        lead.assets = lead.assets || {};
        const landingUrl = await builderEngine.buildLandingPage(lead);
        lead.assets.landing_page_url = landingUrl;

        // Re-generate copies with actual landing page URL
        lead.diagnostics.channel_copies = copyGenerator.generateCopies(lead);
        lead.pipeline_status = 'BUILDING_ASSETS';

        // 6. FILMER AGENT: Generate 10s demo video for high priority leads
        if (lead.diagnostics.high_priority) {
          const videoResult = await filmerEngine.renderDemoVideo(lead);
          lead.assets.video_asset_url = videoResult.videoAssetUrl;
          lead.assets.video_local_path = videoResult.localPath;
        }

        lead.pipeline_status = 'ASSETS_READY';

        // 7. CHECKER AGENT: QA Gatekeeping
        const qaResult = await checkerQA.validateLead(lead);
        lead.qa_verification = qaResult;

        if (qaResult.passed) {
          lead.pipeline_status = 'QUEUED_FOR_PITCH';
          leadDatabase.insertLead(lead);
          processedBatch.push(lead);

          if (progressCallback) {
            await progressCallback(lead);
          }
        } else {
          lead.pipeline_status = 'QA_REJECTED';
          console.warn(`[CHECKER_AGENT] ❌ QA Rejected lead "${lead.company_name}": ${qaResult.rejection_log}`);
        }
      } catch (err) {
        console.error(`[SwarmOrchestrator] Error processing lead ${lead.company_name}: ${err.message}`);
      }
    }

    console.log(`[SwarmOrchestrator] ✅ Batch completed. ${processedBatch.length} leads approved and queued for pitch.`);
    return processedBatch;
  }
}

module.exports = new SwarmOrchestrator();
