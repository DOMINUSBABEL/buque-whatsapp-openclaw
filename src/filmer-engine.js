/**
 * FILMER ENGINE
 * Storyboard compositor for high-converting 10-second vertical (9:16) demo micro-videos.
 *
 * Storyboard Structure:
 * - 0.0s - 3.0s: The Pain Point (Google Maps Profile & review quote / missing web badge)
 * - 3.1s - 8.0s: The Solution (Dynamic mobile scroll of the custom generated landing page)
 * - 8.1s - 10.0s: The Call-to-Action ("Activación directa para tu negocio")
 */
const path = require('path');
const fs = require('fs');
const configManager = require('./config-manager');
const videoCompiler = require('./video-compiler');

const VIDEOS_DIR = path.join(__dirname, '..', 'generated_videos');
if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });

class FilmerEngine {
  constructor() {
    this.baseUrl = configManager.get('publicBaseUrl');
  }

  /**
   * Generates a 10-second vertical video demonstration for the lead
   */
  async renderDemoVideo(lead) {
    const leadSlug = lead.company_name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25);
    const videoFileName = `demo_${leadSlug}_${lead.lead_id.slice(0, 6)}.mp4`;
    const outputPath = path.join(VIDEOS_DIR, videoFileName);

    console.log(`[FILMER_AGENT] Compositing 10s vertical video storyboard for: ${lead.company_name}`);

    const storyboard = {
      leadId: lead.lead_id,
      companyName: lead.company_name,
      rating: lead.scout_metadata?.rating || 4.8,
      reviewsCount: lead.scout_metadata?.reviews_count || 15,
      route: lead.lead_route,
      painSnippet: lead.scout_metadata?.friction_snippet || 'Sin presencia web oficial',
      landingPageUrl: lead.assets?.landing_page_url || `${this.baseUrl}/demo/${leadSlug}`,
      outputPath
    };

    // Compile through the video engine
    await videoCompiler.compileStoryboard(storyboard);

    const videoAssetUrl = `${this.baseUrl}/videos/${videoFileName}`;
    console.log(`[FILMER_AGENT] Video asset compiled successfully -> ${outputPath}`);
    return {
      localPath: outputPath,
      videoAssetUrl
    };
  }
}

module.exports = new FilmerEngine();
