/**
 * GEO TERRITORY SUBSCOUT
 * Deconstructs geographic search queries into precise administrative hierarchies
 * (Country -> Department/State -> City -> Comuna/District -> Neighborhood/Barrio/Kiez/Arrondissement).
 */
const countryRegistry = require('../utils/country-registry');

const KNOWN_MICROZONES = {
  'la milagrosa': { comuna: 'Comuna 9 (Buenos Aires)', city: 'Medellín', state: 'Antioquia', country: 'Colombia', iso: 'CO' },
  'el poblado': { comuna: 'Comuna 14 (El Poblado)', city: 'Medellín', state: 'Antioquia', country: 'Colombia', iso: 'CO' },
  'laureles': { comuna: 'Comuna 11 (Laureles)', city: 'Medellín', state: 'Antioquia', country: 'Colombia', iso: 'CO' },
  'belen': { comuna: 'Comuna 16 (Belén)', city: 'Medellín', state: 'Antioquia', country: 'Colombia', iso: 'CO' },
  'chapinero': { comuna: 'Localidad Chapinero', city: 'Bogotá', state: 'Cundinamarca', country: 'Colombia', iso: 'CO' },
  'usaquen': { comuna: 'Localidad Usaquén', city: 'Bogotá', state: 'Cundinamarca', country: 'Colombia', iso: 'CO' },
  'kreuzberg': { comuna: 'Bezirk Friedrichshain-Kreuzberg', city: 'Berlin', state: 'Berlin', country: 'Alemania', iso: 'DE' },
  'mitte': { comuna: 'Bezirk Mitte', city: 'Berlin', state: 'Berlin', country: 'Alemania', iso: 'DE' },
  'le marais': { comuna: '4e Arrondissement', city: 'Paris', state: 'Île-de-France', country: 'Francia', iso: 'FR' },
  'bourda': { comuna: 'Bourda Ward', city: 'Georgetown', state: 'Demerara-Mahaica', country: 'Guyana', iso: 'GY' },
  'salamanca': { comuna: 'Distrito Salamanca', city: 'Madrid', state: 'Comunidad de Madrid', country: 'España', iso: 'ES' }
};

class GeoTerritorySubscout {
  /**
   * Resolves complete territorial tree from raw query string
   */
  resolveTerritory(query = '') {
    const rawLower = query.toLowerCase();
    const targetCountry = countryRegistry.findCountry(query);

    // 1. Check known micro-zone dictionary
    let resolvedMicro = null;
    for (const [key, val] of Object.entries(KNOWN_MICROZONES)) {
      if (rawLower.includes(key)) {
        resolvedMicro = {
          neighborhood: key.charAt(0).toUpperCase() + key.slice(1),
          district_or_comuna: val.comuna,
          city: val.city,
          state_or_department: val.state,
          country: val.country,
          country_iso: val.iso,
          dialing_code: `+${countryRegistry.findCountry(val.country).code}`
        };
        break;
      }
    }

    if (resolvedMicro) return resolvedMicro;

    // 2. Generic Heuristic Extraction
    const barrioMatch = query.match(/(?:en\s+el\s+barrio|en\s+barrio|en\s+la\s+zona\s+de|en\s+sector|en)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+)/i);
    const rawZone = barrioMatch ? barrioMatch[1].trim() : 'Centro';

    const cityMatch = query.match(/(?:de|en)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?:,\s*|\s*-\s*)([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)?$/i);
    const city = cityMatch ? cityMatch[1].trim() : (targetCountry.name === 'Alemania' ? 'Chemnitz' : (targetCountry.name === 'Guyana' ? 'Georgetown' : 'Medellín'));

    return {
      neighborhood: rawZone,
      district_or_comuna: `Sector ${rawZone}`,
      city: city,
      state_or_department: city,
      country: targetCountry.name,
      country_iso: targetCountry.iso || 'CO',
      dialing_code: `+${targetCountry.code}`
    };
  }
}

module.exports = new GeoTerritorySubscout();
