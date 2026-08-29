/**
 * DESIGN SYSTEM LOADER (v2.4.0)
 * Parses specialized design.md specifications and dynamically matches business models,
 * brand identities, missions, visions, slogans, palettes, and existing products/services.
 */
const fs = require('fs');
const path = require('path');
const themeEngine = require('./theme-engine');

const DESIGN_SYSTEMS_DIR = path.join(__dirname, '..', 'design_systems');

class DesignSystemLoader {
  constructor() {
    this.designDocs = new Map();
    this._loadAllDesignDocs();
  }

  _loadAllDesignDocs() {
    if (!fs.existsSync(DESIGN_SYSTEMS_DIR)) return;
    const files = fs.readdirSync(DESIGN_SYSTEMS_DIR).filter(f => f.endsWith('.design.md'));
    for (const f of files) {
      const fullPath = path.join(DESIGN_SYSTEMS_DIR, f);
      const content = fs.readFileSync(fullPath, 'utf8');
      const key = f.replace('.design.md', '');
      this.designDocs.set(key, { key, filename: f, content });
    }
  }

  /**
   * Resolves the design archetype key based on category and business model
   */
  resolveArchetypeKey(category = '') {
    const cat = (category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (cat.includes('taller') || cat.includes('mecanic') || cat.includes('auto') || cat.includes('ferreter') || cat.includes('industrial') || cat.includes('llanta') || cat.includes('freno')) {
      return 'b2b_industrial_automotive';
    }
    if (cat.includes('restauran') || cat.includes('gastro') || cat.includes('comida') || cat.includes('panader') || cat.includes('café') || cat.includes('cafe') || cat.includes('bakery') || cat.includes('pizza') || cat.includes('burger')) {
      return 'b2c_gastronomy_hospitality';
    }
    if (cat.includes('dental') || cat.includes('clinic') || cat.includes('salud') || cat.includes('médic') || cat.includes('estetic') || cat.includes('spa') || cat.includes('barber') || cat.includes('peluquer') || cat.includes('belleza')) {
      return 'b2c_wellness_medical_beauty';
    }
    if (cat.includes('software') || cat.includes('tech') || cat.includes('ia') || cat.includes('digital') || cat.includes('legal') || cat.includes('abogad') || cat.includes('finanz') || cat.includes('consultor')) {
      return 'b2b_tech_software_consulting';
    }
    if (cat.includes('joyer') || cat.includes('boutique') || cat.includes('moda') || cat.includes('gym') || cat.includes('fitness') || cat.includes('deport') || cat.includes('lujo')) {
      return 'b2c_retail_boutique_fitness';
    }

    return 'b2c_gastronomy_hospitality';
  }

  /**
   * Resolves a complete tailored design profile for a business
   */
  resolveDesignProfile(lead) {
    const category = lead.scout_metadata?.category || lead.category || '';
    const archetypeKey = this.resolveArchetypeKey(category);
    const theme = themeEngine.resolveTheme(category);

    // Dynamic brand mission, vision, and motto synthesis based on real business attributes
    const name = lead.company_name || lead.name || 'Negocio Local';
    const city = lead.location?.city || lead.city || 'la ciudad';

    let motto = theme.tagline || 'Calidad y Atención Directa';
    let mission = `Ofrecer a nuestros clientes en ${city} una experiencia superior con productos y servicios de máxima calidad y atención personalizada.`;
    let vision = `Consolidarnos como el referente de excelencia y confianza en ${category || 'nuestro sector'} en ${city}.`;

    if (archetypeKey === 'b2b_industrial_automotive') {
      motto = `Mecánica de Precisión, Diagnóstico y Garantía en ${city}`;
      mission = `Brindar a cada cliente de ${name} soluciones técnicas confiables, durabilidad garantizada y atención personalizada para sus vehículos y equipos.`;
      vision = `Ser el centro de servicio automotriz e industrial líder en confiabilidad e innovación tecnológica en ${city}.`;
    } else if (archetypeKey === 'b2c_gastronomy_hospitality') {
      motto = `Sabores de Autor y Tradición Culinaria en ${city}`;
      mission = `Ofrecer una experiencia gastronómica memorable en ${name}, con ingredientes frescos y preparación artesanal directa a tu mesa.`;
      vision = `Ser la propuesta culinaria preferida de ${city}, distinguida por la autenticidad, frescura y calidez en cada servicio.`;
    } else if (archetypeKey === 'b2c_wellness_medical_beauty') {
      motto = `Cuidado Experto, Estética y Bienestar en ${city}`;
      mission = `Transformar la salud, confianza y bienestar de nuestros pacientes en ${city} con tratamientos avanzados y calidez humana.`;
      vision = `Ser el centro de salud, odontología y estética de referencia en ${city}, reconocido por la excelencia en resultados.`;
    } else if (archetypeKey === 'b2b_tech_software_consulting') {
      motto = `Automatización Inteligente y Crecimiento Escalable`;
      mission = `Empoderar a empresas con soluciones digitales, arquitectura moderna y automatización de vanguardia para multiplicar su rentabilidad.`;
      vision = `Liderar la adopción de tecnología y software inteligente en ${city} y la región.`;
    } else if (archetypeKey === 'b2c_retail_boutique_fitness') {
      motto = `Estilo Exclusivo, Rendimiento y Distinción en ${city}`;
      mission = `Inspirar superación, estilo y distinción a nuestros clientes a través de colecciones y servicios de alto estándar.`;
      vision = `Ser la marca icónica de estilo de vida, elegancia y rendimiento en ${city}.`;
    }

    return {
      archetypeKey,
      designDoc: this.designDocs.get(archetypeKey) || null,
      theme,
      brand: {
        name,
        category,
        city,
        motto,
        mission,
        vision
      },
      palette: {
        bg_primary: theme.bg_primary,
        bg_card: theme.bg_card || 'rgba(15, 23, 42, 0.88)',
        border_card: theme.border_card || 'rgba(255, 255, 255, 0.1)',
        accent_primary: theme.accent_primary,
        accent_secondary: theme.accent_secondary,
        text_primary: theme.text_primary,
        text_muted: theme.text_muted,
        hero_gradient: theme.hero_gradient,
        hero_image: theme.hero_image,
        catalog_images: theme.catalog_images || []
      },
      typography: {
        heading: theme.font_heading || 'Outfit, sans-serif',
        body: theme.font_body || 'Plus Jakarta Sans, sans-serif',
        mono: 'JetBrains Mono, monospace'
      }
    };
  }
}

module.exports = new DesignSystemLoader();
