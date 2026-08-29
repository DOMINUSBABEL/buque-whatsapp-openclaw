/**
 * INSTITUTIONAL SOURCE ROUTER
 * Directs search queries to authoritative commercial registries, government gazettes,
 * trade boards, and yellow page directories tailored to any target country.
 */

const COUNTRY_SOURCES = {
  'CO': {
    country_name: 'Colombia',
    dialing_code: '57',
    primary_registry: {
      name: 'RUES / Cámaras de Comercio de Colombia',
      authority_url: 'https://www.rues.org.co',
      entity_structure: 'Cámaras de Comercio Departamentales / CONFECAMARAS',
      classification_system: 'CIIU Rev. 4 A.C.',
      activity_codes: {
        'ferreter': { code: '4752', desc: 'Comercio al por menor de artículos de ferretería, pinturas y productos de vidrio' },
        'panader': { code: '1081', desc: 'Elaboración de productos de panadería' },
        'restauran': { code: '5611', desc: 'Expendio a la mesa de comidas preparadas' },
        'dental': { code: '8622', desc: 'Actividades de la práctica odontológica' },
        'estetic': { code: '9602', desc: 'Peluquería y otros tratamientos de belleza' },
        'taller': { code: '4520', desc: 'Mantenimiento y reparación de vehículos automotores' },
        'gastrobar': { code: '5630', desc: 'Expendio de bebidas alcohólicas para el consumo dentro del establecimiento' },
        'software': { code: '6201', desc: 'Actividades de desarrollo de sistemas informáticos' },
        'legal': { code: '6910', desc: 'Actividades jurídicas y de asesoría legal' }
      }
    },
    directories: [
      { name: 'Páginas Amarillas Colombia', url: 'https://www.paginasamarillas.com.co' },
      { name: 'Directorio MinCIT Colombia', url: 'https://www.mincit.gov.co' },
      { name: 'Cámara de Comercio de Medellín para Antioquia', url: 'https://www.camaramedellin.com.co' }
    ]
  },
  'DE': {
    country_name: 'Alemania',
    dialing_code: '49',
    primary_registry: {
      name: 'Handelsregister / Unternehmensregister Deutschland',
      authority_url: 'https://www.handelsregister.de',
      entity_structure: 'Amtsgericht Handelsregister (HRB/HRA)',
      classification_system: 'WZ 2008 (Wirtschaftszweige)',
      activity_codes: {
        'panader': { code: 'WZ 10.71', desc: 'Herstellung von Backwaren' },
        'restauran': { code: 'WZ 56.10', desc: 'Restaurants und Gaststätten' },
        'ferreter': { code: 'WZ 47.52', desc: 'Einzelhandel mit Metallwaren und Heimwerkerbedarf' },
        'dental': { code: 'WZ 86.23', desc: 'Zahnarztpraxen' },
        'software': { code: 'WZ 62.01', desc: 'Programmierungstätigkeiten' }
      }
    },
    directories: [
      { name: 'Gelbe Seiten Deutschland', url: 'https://www.gelbeseiten.de' },
      { name: 'Das Örtliche', url: 'https://www.dasoertliche.de' },
      { name: 'IHK Verzeichnis', url: 'https://www.ihk.de' }
    ]
  },
  'FR': {
    country_name: 'Francia',
    dialing_code: '33',
    primary_registry: {
      name: 'Registre du Commerce et des Sociétés (RCS / SIRENE)',
      authority_url: 'https://data.gouv.fr / https://www.infogreffe.fr',
      entity_structure: 'Greffe du Tribunal de Commerce',
      classification_system: 'Code NAF / APE',
      activity_codes: {
        'panader': { code: 'NAF 10.71C', desc: 'Boulangerie et boulangerie-pâtisserie' },
        'restauran': { code: 'NAF 56.10A', desc: 'Restauration traditionnelle' },
        'ferreter': { code: 'NAF 47.52A', desc: 'Commerce de détail de quincaillerie et bricolage' },
        'dental': { code: 'NAF 86.23Z', desc: 'Pratique dentaire' }
      }
    },
    directories: [
      { name: 'PagesJaunes France', url: 'https://www.pagesjaunes.fr' },
      { name: 'Societe.com', url: 'https://www.societe.com' }
    ]
  },
  'US': {
    country_name: 'Estados Unidos',
    dialing_code: '1',
    primary_registry: {
      name: 'Secretary of State / Division of Corporations',
      authority_url: 'https://openbusinesssearch.gov',
      entity_structure: 'State Department of State (Division of Corporations)',
      classification_system: 'NAICS 2022',
      activity_codes: {
        'bakery': { code: 'NAICS 311811', desc: 'Retail Bakeries' },
        'restaurant': { code: 'NAICS 722511', desc: 'Full-Service Restaurants' },
        'hardware': { code: 'NAICS 444130', desc: 'Hardware Stores' },
        'dental': { code: 'NAICS 621210', desc: 'Offices of Dentists' }
      }
    },
    directories: [
      { name: 'YellowPages US', url: 'https://www.yellowpages.com' },
      { name: 'Better Business Bureau (BBB)', url: 'https://www.bbb.org' },
      { name: 'Manta B2B Directory', url: 'https://www.manta.com' }
    ]
  },
  'ES': {
    country_name: 'España',
    dialing_code: '34',
    primary_registry: {
      name: 'Registro Mercantil Central (España)',
      authority_url: 'https://www.registradores.org',
      entity_structure: 'Colegio de Registradores de la Propiedad y Mercantiles',
      classification_system: 'CNAE 2009',
      activity_codes: {
        'panader': { code: 'CNAE 1071', desc: 'Fabricación de pan y de productos frescos de panadería' },
        'restauran': { code: 'CNAE 5610', desc: 'Restaurantes y puestos de comidas' },
        'ferreter': { code: 'CNAE 4752', desc: 'Comercio al por menor de ferretería, pintura y vidrio' }
      }
    },
    directories: [
      { name: 'Páginas Amarillas España', url: 'https://www.paginasamarillas.es' },
      { name: 'Directorio Einforma', url: 'https://www.einforma.com' }
    ]
  },
  'GY': {
    country_name: 'Guyana',
    dialing_code: '592',
    primary_registry: {
      name: 'Guyana Deeds and Commercial Registry Authority (DCRA)',
      authority_url: 'https://dcra.gov.gy',
      entity_structure: 'Commercial Registry Authority of Guyana',
      classification_system: 'ISIC Rev. 4',
      activity_codes: {
        'bakery': { code: 'ISIC 1071', desc: 'Manufacture of bakery products' },
        'hardware': { code: 'ISIC 4752', desc: 'Retail sale of hardware in specialized stores' }
      }
    },
    directories: [
      { name: 'Guyana Yellow Pages', url: 'https://www.guyanayellowpages.com' },
      { name: 'Georgetown Chamber of Commerce & Industry (GCCI)', url: 'https://gcci.gy' }
    ]
  }
};

class InstitutionalSourceRouter {
  /**
   * Resolves the primary official registers, classification system and trusted directories
   */
  resolveSources(countryIso = 'CO') {
    const iso = countryIso.toUpperCase();
    return COUNTRY_SOURCES[iso] || COUNTRY_SOURCES['CO'];
  }

  /**
   * Returns activity code and title for target country and query keyword
   */
  resolveActivityCode(countryIso = 'CO', nicheKeyword = '') {
    const sourceInfo = this.resolveSources(countryIso);
    const codes = sourceInfo.primary_registry.activity_codes || {};
    const lower = (nicheKeyword || '').toLowerCase();

    for (const [key, val] of Object.entries(codes)) {
      if (lower.includes(key)) {
        return {
          system: sourceInfo.primary_registry.classification_system,
          code: val.code,
          title: val.desc
        };
      }
    }

    return {
      system: sourceInfo.primary_registry.classification_system,
      code: 'GEN-001',
      title: `Comercio y Servicios Especializados (${nicheKeyword || 'General'})`
    };
  }
}

module.exports = new InstitutionalSourceRouter();
