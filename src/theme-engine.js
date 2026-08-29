/**
 * THEME ENGINE (Ultra-Premium Luxury Aesthetics & Bespoke Sector Palettes)
 * Provides 10+ tailored visual suites with custom typography pairings,
 * glassmorphism card tokens, dynamic gradient overlays, and curated high-resolution photography.
 */

const LUXURY_THEMES = {
  HARDWARE_INDUSTRIAL: {
    key: 'HARDWARE_INDUSTRIAL',
    name: 'Titanium Industrial & Heavy Tools',
    tagline: 'Solidez, Precisión y Rendimiento Técnico',
    bg_primary: '#070a12',
    bg_card: 'rgba(15, 23, 42, 0.85)',
    border_card: 'rgba(245, 158, 11, 0.25)',
    accent_primary: '#f59e0b', // Amber Gold
    accent_secondary: '#06b6d4', // Cyan
    text_primary: '#f8fafc',
    text_muted: '#94a3b8',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80'
    ]
  },

  AUTOMOTIVE_DETAILING: {
    key: 'AUTOMOTIVE_DETAILING',
    name: 'Supercar Crimson & Matte Graphite',
    tagline: 'Mecánica de Precisión, Car Detailing y Potencia',
    bg_primary: '#08080a',
    bg_card: 'rgba(20, 20, 24, 0.85)',
    border_card: 'rgba(239, 68, 68, 0.3)',
    accent_primary: '#ef4444', // Crimson Red
    accent_secondary: '#f97316', // Orange Flame
    text_primary: '#fafafa',
    text_muted: '#a1a1aa',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(8, 8, 10, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80'
    ]
  },

  GOURMET_GASTRONOMY: {
    key: 'GOURMET_GASTRONOMY',
    name: 'Obsidian Culinary & Wine',
    tagline: 'Experiencia Gastronómica de Autor',
    bg_primary: '#09090b',
    bg_card: 'rgba(24, 24, 27, 0.85)',
    border_card: 'rgba(225, 29, 72, 0.25)',
    accent_primary: '#e11d48', // Flame Rose
    accent_secondary: '#eab308', // Gold
    text_primary: '#fafafa',
    text_muted: '#a1a1aa',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.25) 0%, rgba(9, 9, 11, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80'
    ]
  },

  ARTISAN_BAKERY: {
    key: 'ARTISAN_BAKERY',
    name: 'Warm Terracotta, Espresso & Cream',
    tagline: 'Panadería Artesanal, Masa Madre y Café Especial',
    bg_primary: '#0f0c0a',
    bg_card: 'rgba(30, 24, 20, 0.85)',
    border_card: 'rgba(245, 158, 11, 0.3)',
    accent_primary: '#d97706', // Warm Amber
    accent_secondary: '#fbbf24', // Butter Gold
    text_primary: '#fef3c7',
    text_muted: '#d4b996',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(15, 12, 10, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80'
    ]
  },

  MEDICAL_DENTAL: {
    key: 'MEDICAL_DENTAL',
    name: 'Arctic Clean Slate & Mint',
    tagline: 'Odontología Avanzada, Salud y Precisión Clínica',
    bg_primary: '#070e1a',
    bg_card: 'rgba(11, 23, 44, 0.85)',
    border_card: 'rgba(56, 189, 248, 0.25)',
    accent_primary: '#38bdf8', // Sky Blue
    accent_secondary: '#10b981', // Mint Emerald
    text_primary: '#f0f9ff',
    text_muted: '#7dd3fc',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(7, 14, 26, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80'
    ]
  },

  AESTHETIC_SPA: {
    key: 'AESTHETIC_SPA',
    name: 'Royal Velvet & Rose Quartz',
    tagline: 'Estética Integral, Spa & Alta Belleza',
    bg_primary: '#0e0614',
    bg_card: 'rgba(28, 12, 42, 0.85)',
    border_card: 'rgba(244, 63, 94, 0.25)',
    accent_primary: '#f43f5e', // Rose
    accent_secondary: '#fbbf24', // Champagne Gold
    text_primary: '#fff1f2',
    text_muted: '#fda4af',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(14, 6, 20, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
    ]
  },

  TECH_AUTOMATION: {
    key: 'TECH_AUTOMATION',
    name: 'Cyber Matrix Neon Cyan & Indigo',
    tagline: 'Software, Automatización con Inteligencia Artificial y Cloud',
    bg_primary: '#060814',
    bg_card: 'rgba(10, 16, 38, 0.85)',
    border_card: 'rgba(99, 102, 241, 0.3)',
    accent_primary: '#6366f1', // Electric Indigo
    accent_secondary: '#06b6d4', // Neon Cyan
    text_primary: '#eef2ff',
    text_muted: '#a5b4fc',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 8, 20, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
    ]
  },

  LEGAL_FINANCE: {
    key: 'LEGAL_FINANCE',
    name: 'Emerald Sovereign & Platinum',
    tagline: 'Consultoría Legal, Tributaria y Finanzas Estratégicas',
    bg_primary: '#050d0a',
    bg_card: 'rgba(10, 28, 20, 0.85)',
    border_card: 'rgba(16, 185, 129, 0.25)',
    accent_primary: '#10b981', // Emerald
    accent_secondary: '#e2e8f0', // Platinum
    text_primary: '#ecfdf5',
    text_muted: '#a7f3d0',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 13, 10, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
    ]
  },

  FITNESS_SPORTS: {
    key: 'FITNESS_SPORTS',
    name: 'Electric Lime & Pitch Carbon',
    tagline: 'Alto Rendimiento, Entrenamiento y Nutrición',
    bg_primary: '#080b06',
    bg_card: 'rgba(18, 26, 14, 0.85)',
    border_card: 'rgba(132, 204, 22, 0.3)',
    accent_primary: '#84cc16', // Electric Lime
    accent_secondary: '#22c55e', // Neon Green
    text_primary: '#f7fee7',
    text_muted: '#d9f99d',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(132, 204, 22, 0.25) 0%, rgba(8, 11, 6, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80'
    ]
  },

  LUXURY_JEWELRY_FASHION: {
    key: 'LUXURY_JEWELRY_FASHION',
    name: 'Onyx Noir & Gold Leaf',
    tagline: 'Alta Joyería, Relojería y Moda Exclusiva',
    bg_primary: '#060606',
    bg_card: 'rgba(18, 18, 18, 0.85)',
    border_card: 'rgba(234, 179, 8, 0.3)',
    accent_primary: '#eab308', // Gold Leaf
    accent_secondary: '#fef08a', // Pale Gold
    text_primary: '#fefce8',
    text_muted: '#ca8a04',
    font_heading: 'Outfit, sans-serif',
    font_body: 'Plus Jakarta Sans, sans-serif',
    hero_gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(6, 6, 6, 0.95) 100%)',
    hero_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
    ]
  }
};

class ThemeEngine {
  /**
   * Resolves the bespoke theme configuration based on business category and keywords
   */
  resolveTheme(category = '') {
    const cat = (category || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Automotive & Detailing
    if (cat.includes('taller') || cat.includes('mecanic') || cat.includes('auto') || cat.includes('detailing') || cat.includes('repuesto') || cat.includes('motor') || cat.includes('kfz')) {
      return LUXURY_THEMES.AUTOMOTIVE_DETAILING;
    }

    // 2. Hardware, Industrial & Tools
    if (cat.includes('ferreter') || cat.includes('hardware') || cat.includes('construcc') || cat.includes('industrial') || cat.includes('material') || cat.includes('herramienta')) {
      return LUXURY_THEMES.HARDWARE_INDUSTRIAL;
    }

    // 3. Artisan Bakery & Café
    if (cat.includes('panader') || cat.includes('bakery') || cat.includes('bäckerei') || cat.includes('boulangerie') || cat.includes('café') || cat.includes('cafe') || cat.includes('reposteria') || cat.includes('pasteler')) {
      return LUXURY_THEMES.ARTISAN_BAKERY;
    }

    // 4. Gourmet Gastronomy & Dining
    if (cat.includes('restauran') || cat.includes('gastrobar') || cat.includes('bistro') || cat.includes('comida') || cat.includes('sushi') || cat.includes('pizza') || cat.includes('parrilla')) {
      return LUXURY_THEMES.GOURMET_GASTRONOMY;
    }

    // 5. Medical & Dental Health
    if (cat.includes('dental') || cat.includes('odontolog') || cat.includes('clinic') || cat.includes('salud') || cat.includes('médic') || cat.includes('doctor') || cat.includes('optica')) {
      return LUXURY_THEMES.MEDICAL_DENTAL;
    }

    // 6. Aesthetic, Spa & Beauty
    if (cat.includes('estetic') || cat.includes('spa') || cat.includes('belleza') || cat.includes('peluquer') || cat.includes('barber') || cat.includes('salon') || cat.includes('coiffure')) {
      return LUXURY_THEMES.AESTHETIC_SPA;
    }

    // 7. Tech & AI Automation
    if (cat.includes('software') || cat.includes('tech') || cat.includes('digital') || cat.includes('computo') || cat.includes('sistema') || cat.includes('ia') || cat.includes('ai')) {
      return LUXURY_THEMES.TECH_AUTOMATION;
    }

    // 8. Legal & Finance
    if (cat.includes('legal') || cat.includes('abogad') || cat.includes('contab') || cat.includes('tributar') || cat.includes('notar') || cat.includes('asesor')) {
      return LUXURY_THEMES.LEGAL_FINANCE;
    }

    // 9. Fitness & Sports
    if (cat.includes('gym') || cat.includes('gimnasio') || cat.includes('fitness') || cat.includes('crossfit') || cat.includes('deport') || cat.includes('entrenam')) {
      return LUXURY_THEMES.FITNESS_SPORTS;
    }

    // 10. Luxury Jewelry & Fashion
    if (cat.includes('joyer') || cat.includes('reloj') || cat.includes('boutique') || cat.includes('moda') || cat.includes('lujo')) {
      return LUXURY_THEMES.LUXURY_JEWELRY_FASHION;
    }

    // Default fallback
    return LUXURY_THEMES.HARDWARE_INDUSTRIAL;
  }

  getAllThemes() {
    return LUXURY_THEMES;
  }
}

module.exports = new ThemeEngine();
