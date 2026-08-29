/**
 * THEME ENGINE (Ultra-Premium Aesthetics & Dynamic Palette Generator)
 * Delivers bespoke high-contrast luxury themes, glassmorphism tokens,
 * curated typography pairings, and niche-specific imagery assets.
 */

const THEMES = {
  HARDWARE_INDUSTRIAL: {
    name: 'Titanium Industrial & Tools',
    bg_primary: '#090d16',
    bg_card: 'rgba(15, 23, 42, 0.75)',
    border_card: 'rgba(245, 158, 11, 0.25)',
    accent_primary: '#f59e0b', // Amber Gold
    accent_secondary: '#06b6d4', // Cyan
    text_primary: '#f8fafc',
    text_muted: '#94a3b8',
    gradient_hero: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #06b6d4 100%)',
    hero_image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80'
    ]
  },
  GOURMET_GASTRONOMY: {
    name: 'Obsidian Culinary & Bakery',
    bg_primary: '#09090b',
    bg_card: 'rgba(24, 24, 27, 0.75)',
    border_card: 'rgba(225, 29, 72, 0.25)',
    accent_primary: '#e11d48', // Flame Rose
    accent_secondary: '#f59e0b', // Amber Warm
    text_primary: '#fafafa',
    text_muted: '#a1a1aa',
    gradient_hero: 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #f59e0b 100%)',
    hero_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80'
    ]
  },
  MEDICAL_HEALTH: {
    name: 'Arctic Clean & Clinical',
    bg_primary: '#080d1a',
    bg_card: 'rgba(11, 19, 41, 0.75)',
    border_card: 'rgba(56, 189, 248, 0.25)',
    accent_primary: '#38bdf8', // Sky Blue
    accent_secondary: '#10b981', // Mint Emerald
    text_primary: '#f0f9ff',
    text_muted: '#7dd3fc',
    gradient_hero: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #10b981 100%)',
    hero_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80'
    ]
  },
  LUXURY_BOUTIQUE: {
    name: 'Royal Velvet & Aesthetics',
    bg_primary: '#0d0614',
    bg_card: 'rgba(24, 8, 40, 0.75)',
    border_card: 'rgba(244, 63, 94, 0.25)',
    accent_primary: '#f43f5e', // Rose
    accent_secondary: '#fbbf24', // Gold
    text_primary: '#fff1f2',
    text_muted: '#fda4af',
    gradient_hero: 'linear-gradient(135deg, #f43f5e 0%, #9333ea 50%, #fbbf24 100%)',
    hero_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
    ]
  },
  PROFESSIONAL_SERVICES: {
    name: 'Cyber Indigo & Corporate',
    bg_primary: '#080a12',
    bg_card: 'rgba(10, 15, 29, 0.75)',
    border_card: 'rgba(99, 102, 241, 0.25)',
    accent_primary: '#6366f1', // Electric Indigo
    accent_secondary: '#22c55e', // Emerald
    text_primary: '#eef2ff',
    text_muted: '#a5b4fc',
    gradient_hero: 'linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #22c55e 100%)',
    hero_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    catalog_images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
    ]
  }
};

class ThemeEngine {
  /**
   * Resolves the bespoke theme configuration based on business category
   */
  resolveTheme(category = '') {
    const cat = category.toLowerCase();
    if (cat.includes('ferreter') || cat.includes('taller') || cat.includes('auto') || cat.includes('hardware') || cat.includes('industrial')) {
      return THEMES.HARDWARE_INDUSTRIAL;
    }
    if (cat.includes('panader') || cat.includes('restauran') || cat.includes('gastrobar') || cat.includes('bakery') || cat.includes('café') || cat.includes('cafe') || cat.includes('bäckerei')) {
      return THEMES.GOURMET_GASTRONOMY;
    }
    if (cat.includes('dental') || cat.includes('odontolog') || cat.includes('clinic') || cat.includes('salud') || cat.includes('médic')) {
      return THEMES.MEDICAL_HEALTH;
    }
    if (cat.includes('estetic') || cat.includes('spa') || cat.includes('belleza') || cat.includes('boutique') || cat.includes('salon')) {
      return THEMES.LUXURY_BOUTIQUE;
    }
    return THEMES.PROFESSIONAL_SERVICES;
  }
}

module.exports = new ThemeEngine();
