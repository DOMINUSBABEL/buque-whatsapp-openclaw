/**
 * BUILDER ENGINE
 * Compiles hyper-personalized mobile-first landing pages tailored to the business's
 * exact products, services, and Google Maps reviews.
 */
const fs = require('fs');
const path = require('path');
const configManager = require('./config-manager');
const catalogBuilder = require('./catalog-builder');

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
   * Generates a complete standalone landing page for the lead (Web Directa or VAREGO Proposal)
   */
  async buildLandingPage(lead) {
    const slug = this._generateSlug(lead.company_name, lead.lead_id);
    const siteFolder = path.join(SITES_DIR, slug);
    if (!fs.existsSync(siteFolder)) {
      fs.mkdirSync(siteFolder, { recursive: true });
    }

    const phoneClean = (lead.contact_channel?.phone_e164 || '').replace(/[^0-9]/g, '');
    const isVarego = lead.lead_route === 'RUTA_C_VAREGO';
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

      const themeEngine = require('./theme-engine');
      const theme = themeEngine.resolveTheme(lead.scout_metadata?.category || '');

      const catalogItems = lead.assets?.catalog_items ||
        catalogBuilder.extractCatalog({
          category: lead.scout_metadata?.category,
          reviews_snippets: lead.scout_metadata?.reviews_snippets,
          contact_channel: lead.contact_channel
        });

      const catalogHtml = catalogItems.map((item, idx) => {
        const itemImg = theme.catalog_images ? theme.catalog_images[idx % theme.catalog_images.length] : null;
        return `
        <div class="glass-card p-4 rounded-2xl flex items-center justify-between hover:border-amber-500/40 transition gap-3">
          ${itemImg ? `<img src="${itemImg}" alt="${item.title}" class="w-14 h-14 object-cover rounded-xl border border-white/10 flex-shrink-0" />` : ''}
          <div class="flex-1 pr-2">
            <h3 class="font-bold text-sm text-white">${item.title}</h3>
            <p class="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">${item.description}</p>
            <span class="inline-block text-[11px] font-bold text-amber-400 mt-1">${item.price_tag || 'Consultar'}</span>
          </div>
          <a href="https://wa.me/${phoneClean}?text=Hola,%20quiero%20información%20sobre%20el%20servicio:%20${encodeURIComponent(item.title)}"
             class="flex-shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition shadow-lg shadow-amber-950/40">
            Pedir 📲
          </a>
        </div>
      `;}).join('\n');

      template = template
        .replace(/{{COMPANY_NAME}}/g, lead.company_name)
        .replace(/{{CATEGORY}}/g, lead.scout_metadata?.category || 'Negocio Local')
        .replace(/{{CITY}}/g, lead.location?.city || 'Medellín')
        .replace(/{{RATING}}/g, (lead.scout_metadata?.rating || 4.8).toFixed(1))
        .replace(/{{REVIEWS_COUNT}}/g, String(lead.scout_metadata?.reviews_count || 12))
        .replace(/{{ADDRESS}}/g, lead.location?.address || 'Ubicación céntrica')
        .replace(/{{PHONE_CLEAN}}/g, phoneClean)
        .replace(/{{CATALOG_ITEMS_HTML}}/g, catalogHtml)
        .replace(/{{HERO_IMAGE}}/g, theme.hero_image || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=85')
        .replace(/{{BG_PRIMARY}}/g, theme.bg_primary || '#090d16')
        .replace(/{{ACCENT_PRIMARY}}/g, theme.accent_primary || '#f59e0b');
    }

    const indexPath = path.join(siteFolder, 'index.html');
    fs.writeFileSync(indexPath, template, 'utf8');

    const landingUrl = `${this.baseUrl}/demo/${slug}`;
    console.log(`[BUILDER_AGENT] Generated ${isVarego ? 'VAREGO Proposal' : 'Web Directa'} for ${lead.company_name} -> ${landingUrl}`);
    return landingUrl;
  }

  _generateSlug(name, id) {
    const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const shortId = (id || '000').slice(0, 6);
    return `${clean}-${shortId}`;
  }

  _generateFallbackCatalog(lead) {
    const cat = (lead.scout_metadata?.category || '').toLowerCase();
    if (cat.includes('dental') || cat.includes('odonto') || cat.includes('salud')) {
      return [
        { title: 'Valoración y Diagnóstico Integral', description: 'Evaluación clínica completa con escaneo digital y presupuesto.', price_tag: 'Cita Prioritaria' },
        { title: 'Limpieza y Profilaxis Profunda', description: 'Remoción de placa bacteriana y pulido de alta tecnología.', price_tag: 'Promoción del mes' },
        { title: 'Diseño de Sonrisa & Estética', description: 'Carillas y aclaramiento dental con resultados garantizados.', price_tag: 'Cotización personalizada' }
      ];
    } else if (cat.includes('restaurante') || cat.includes('pizza') || cat.includes('comida') || cat.includes('sabor')) {
      return [
        { title: 'Especialidad de la Casa', description: 'Plato insignia preparado con ingredientes frescos del día.', price_tag: 'Más pedido' },
        { title: 'Combo Familiar / Dúo', description: 'Incluye entrada, plato principal y bebidas artesanales.', price_tag: 'Ahorra 15%' },
        { title: 'Menú Ejecutivo Diario', description: 'Sopa del día, proteína al gusto, acompañamientos y postre.', price_tag: 'De Lun a Vie' }
      ];
    } else {
      return [
        { title: 'Servicio Estándar Garantizado', description: 'Atención personalizada y cumplimiento en tiempos de entrega.', price_tag: 'Popular' },
        { title: 'Paquete Integral Premium', description: 'Solución completa llave en mano con soporte directo.', price_tag: 'Recomendado' },
        { title: 'Cotización Inmediata a Medida', description: 'Envíanos los detalles de tu requerimiento y te respondemos en minutos.', price_tag: 'Sin compromiso' }
      ];
    }
  }
}

module.exports = new BuilderEngine();
