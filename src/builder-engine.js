/**
 * BUILDER ENGINE (v2.4.0)
 * Compiles hyper-personalized mobile-first landing pages and interactive web prototypes
 * driven by dynamic design.md profiles, business archetype mission/vision,
 * real existing brand assets/services, and automated Puppeteer mobile screenshots.
 */
const fs = require('fs');
const path = require('path');
const configManager = require('./config-manager');
const catalogBuilder = require('./catalog-builder');
const designSystemLoader = require('./design-system-loader');
const screenshotEngine = require('./screenshot-engine');

const TEMPLATE_WEB_FILE = path.join(__dirname, '..', 'templates', 'landing-base.html');
const TEMPLATE_VAREGO_FILE = path.join(__dirname, '..', 'templates', 'varego-landing.html');
const SITES_DIR = path.join(__dirname, '..', 'generated_sites');

if (!fs.existsSync(SITES_DIR)) {
  fs.mkdirSync(SITES_DIR, { recursive: true });
}

class BuilderEngine {
  constructor() {
    this.baseUrl = configManager.get('publicBaseUrl');
  }

  /**
   * Generates a complete standalone landing page & high-res mobile screenshot for the lead
   */
  async buildLandingPage(lead) {
    const slug = this._generateSlug(lead.company_name, lead.lead_id);
    const siteFolder = path.join(SITES_DIR, slug);
    if (!fs.existsSync(siteFolder)) {
      fs.mkdirSync(siteFolder, { recursive: true });
    }

    const phoneClean = (lead.contact_channel?.phone_e164 || '').replace(/[^0-9]/g, '');
    const isVarego = lead.lead_route === 'RUTA_C_VAREGO';

    // 1. Resolve Tailored Design Profile from design.md Specifications
    const designProfile = designSystemLoader.resolveDesignProfile(lead);
    lead.design_profile = designProfile;

    let template = '';

    if (isVarego && fs.existsSync(TEMPLATE_VAREGO_FILE)) {
      // VAREGO Social & Ads Proposal Page
      template = fs.readFileSync(TEMPLATE_VAREGO_FILE, 'utf8');

      const handle = lead.scout_metadata?.social_audit?.instagram_handle || `@${lead.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const daysAgo = lead.scout_metadata?.social_audit?.last_post_days_ago || 30;
      const statusSnippet = daysAgo > 20 ? `Inactivo hace ${daysAgo} días` : 'Sin pauta Meta Ads activa';

      const contentIdeas = [
        { title: 'Reel 1: Detrás de Cámaras & Preparación', desc: 'Video dinámico con audio en tendencia mostrando la calidad del servicio.', hook: 'Genera confianza inmediata' },
        { title: 'Post 2: Oferta Irresistible de la Semana', desc: 'Diseño publicitario optimizado con llamado a la acción directo al WhatsApp.', hook: 'Conversión directa' },
        { title: 'Reel 3: Testimonio Real de Cliente', desc: 'Reseña en video destacando la experiencia y satisfacción del cliente.', hook: 'Prueba social de alto impacto' }
      ];

      const contentHtml = contentIdeas.map(item => `
        <div class="glass-card p-4 rounded-2xl border-pink-500/20">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-white">${item.title}</h3>
            <span class="text-[10px] font-bold text-pink-300 px-2 py-0.5 rounded-md bg-pink-950/40">${item.hook}</span>
          </div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">${item.desc}</p>
        </div>
      `).join('\n');

      template = template
        .replace(/{{COMPANY_NAME}}/g, lead.company_name)
        .replace(/{{CITY}}/g, lead.location?.city || 'Medellín')
        .replace(/{{INSTAGRAM_HANDLE}}/g, handle)
        .replace(/{{SOCIAL_STATUS_SNIPPET}}/g, statusSnippet)
        .replace(/{{PHONE_CLEAN}}/g, phoneClean)
        .replace(/{{CONTENT_IDEAS_HTML}}/g, contentHtml);

    } else {
      // Web Directa Page (Rutas A/B)
      template = fs.readFileSync(TEMPLATE_WEB_FILE, 'utf8');

      const palette = designProfile.palette;
      const brand = designProfile.brand;

      const catalogItems = lead.assets?.catalog_items ||
        catalogBuilder.extractCatalog({
          category: lead.scout_metadata?.category,
          reviews_snippets: lead.scout_metadata?.reviews_snippets,
          contact_channel: lead.contact_channel
        });

      const catalogHtml = catalogItems.map((item, idx) => {
        const itemImg = (palette.catalog_images && palette.catalog_images.length > 0)
          ? palette.catalog_images[idx % palette.catalog_images.length]
          : null;
        const priceClean = item.price_tag || '$25 USD';
        return `
        <div class="glass-card catalog-card p-4 rounded-2xl flex items-center justify-between hover:border-amber-500/40 transition gap-3 border-slate-800/80">
          ${itemImg ? `<img src="${itemImg}" alt="${item.title}" class="w-14 h-14 object-cover rounded-xl border border-white/10 flex-shrink-0" />` : ''}
          <div class="flex-1 pr-2">
            <h3 class="font-bold text-sm text-white font-heading">${item.title}</h3>
            <p class="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">${item.description}</p>
            <span class="inline-block text-[11px] font-mono-data font-bold text-amber-400 mt-1">${priceClean}</span>
          </div>
          <div class="flex flex-col gap-1.5 flex-shrink-0">
            <button onclick="addToCart('${item.title.replace(/'/g, "\\'")}', '${priceClean}')"
                    class="bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 border border-amber-500/30 font-bold text-[11px] px-3 py-1.5 rounded-xl transition shadow-md">
              ➕ Agregar
            </button>
            <a href="https://wa.me/${phoneClean}?text=Hola,%20quiero%20información%20sobre:%20${encodeURIComponent(item.title)}"
               class="bg-gradient-to-r from-emerald-500 to-teal-500 active:scale-95 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl text-center transition shadow-md">
              Pedir 📲
            </a>
          </div>
        </div>
      `;}).join('\n');

      template = template
        .replace(/{{COMPANY_NAME}}/g, lead.company_name)
        .replace(/{{CATEGORY}}/g, lead.scout_metadata?.category || 'Negocio Local')
        .replace(/{{CITY}}/g, lead.location?.city || brand.city || 'Medellín')
        .replace(/{{RATING}}/g, (lead.scout_metadata?.rating || 4.8).toFixed(1))
        .replace(/{{REVIEWS_COUNT}}/g, String(lead.scout_metadata?.reviews_count || 12))
        .replace(/{{ADDRESS}}/g, lead.location?.address || 'Ubicación céntrica')
        .replace(/{{PHONE_CLEAN}}/g, phoneClean)
        .replace(/{{CATALOG_ITEMS_HTML}}/g, catalogHtml)
        .replace(/{{TAGLINE}}/g, brand.motto)
        .replace(/{{BRAND_MISSION}}/g, brand.mission)
        .replace(/{{BRAND_VISION}}/g, brand.vision)
        .replace(/{{HERO_IMAGE}}/g, palette.hero_image || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=85')
        .replace(/{{BG_PRIMARY}}/g, palette.bg_primary || '#090d16')
        .replace(/{{BG_CARD}}/g, palette.bg_card || 'rgba(15, 23, 42, 0.88)')
        .replace(/{{ACCENT_PRIMARY}}/g, palette.accent_primary || '#f59e0b')
        .replace(/{{ACCENT_SECONDARY}}/g, palette.accent_secondary || '#06b6d4')
        .replace(/{{BORDER_CARD}}/g, palette.border_card || 'rgba(245, 158, 11, 0.25)');
    }

    const indexPath = path.join(siteFolder, 'index.html');
    fs.writeFileSync(indexPath, template, 'utf8');

    const landingUrl = `${this.baseUrl}/demo/${slug}`;
    console.log(`[BUILDER_AGENT] Generated ${isVarego ? 'VAREGO Proposal' : 'Web Directa'} for ${lead.company_name} -> ${landingUrl}`);

    // 2. Generate High-Fidelity Mobile Screenshot
    try {
      const screenshotPath = await screenshotEngine.captureLandingPage(indexPath, slug);
      if (!lead.assets) lead.assets = {};
      lead.assets.landing_page_url = landingUrl;
      lead.assets.screenshot_local_path = screenshotPath;
      lead.assets.screenshot_url = `${this.baseUrl}/screenshots/${slug}.png`;
    } catch (scErr) {
      console.warn(`[BUILDER_AGENT] Screenshot capture warning: ${scErr.message}`);
    }

    return landingUrl;
  }

  _generateSlug(name, id) {
    const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const shortId = (id || '000').slice(0, 6);
    return `${clean}-${shortId}`;
  }
}

module.exports = new BuilderEngine();
