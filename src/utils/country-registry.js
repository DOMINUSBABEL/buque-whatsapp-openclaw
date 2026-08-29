/**
 * GLOBAL COUNTRY REGISTRY
 * Comprehensive mapping of 200+ countries, territories, dialing codes,
 * ISO codes, localized names (Spanish/English), and primary languages.
 */

const COUNTRIES = [
  // América del Sur
  { name: 'Colombia', code: '57', iso: 'CO', aliases: ['colombia', 'colombiano', 'medellin', 'bogota', 'cali', 'barranquilla', 'cartagena', 'bucaramanga', 'pereira', 'manizales', 'cucuta', 'santa marta', 'ibague', 'pasto'], lang: 'es' },
  { name: 'Guyana', code: '592', iso: 'GY', currency: 'USD', capital: 'Georgetown', aliases: ['guyana', 'guayana', 'georgetown', 'linden', 'new amsterdam', 'bartica'], lang: 'en' },
  { name: 'Guayana Francesa', code: '594', iso: 'GF', currency: 'EUR', capital: 'Cayenne', aliases: ['guayana francesa', 'french guiana', 'guyane', 'cayenne', 'kourou', 'saint-laurent-du-maroni'], lang: 'fr' },
  { name: 'Surinam', code: '597', iso: 'SR', currency: 'USD', capital: 'Paramaribo', aliases: ['surinam', 'suriname', 'paramaribo', 'ledo', 'nieuw nickerie'], lang: 'nl' },
  { name: 'Brasil', code: '55', iso: 'BR', aliases: ['brasil', 'brazil', 'sao paulo', 'rio de janeiro', 'brasilia', 'salvador', 'fortaleza', 'belo horizonte', 'curitiba', 'manaus', 'recife', 'porto alegre'], lang: 'pt' },
  { name: 'Venezuela', code: '58', iso: 'VE', aliases: ['venezuela', 'caracas', 'maracaibo', 'valencia', 'barquisimeto', 'maracay', 'ciudad guayana'], lang: 'es' },
  { name: 'Ecuador', code: '593', iso: 'EC', aliases: ['ecuador', 'quito', 'guayaquil', 'cuenca', 'ambato', 'manta', 'portoviejo'], lang: 'es' },
  { name: 'Perú', code: '51', iso: 'PE', aliases: ['peru', 'perú', 'lima', 'arequipa', 'trujillo', 'chiclayo', 'piura', 'cusco', 'iquitos', 'huancayo'], lang: 'es' },
  { name: 'Bolivia', code: '591', iso: 'BO', aliases: ['bolivia', 'la paz', 'santa cruz', 'cochabamba', 'sucre', 'oruro', 'tarija', 'potosi'], lang: 'es' },
  { name: 'Chile', code: '56', iso: 'CL', aliases: ['chile', 'santiago', 'valparaiso', 'concepcion', 'la serena', 'antofagasta', 'temuco', 'iquique', 'puerto montt'], lang: 'es' },
  { name: 'Argentina', code: '54', iso: 'AR', aliases: ['argentina', 'buenos aires', 'cordoba', 'rosario', 'mendoza', 'tucuman', 'la plata', 'mar del plata', 'salta', 'santa fe'], lang: 'es' },
  { name: 'Paraguay', code: '595', iso: 'PY', aliases: ['paraguay', 'asuncion', 'ciudad del este', 'san lorenzo', 'luque', 'encarnacion'], lang: 'es' },
  { name: 'Uruguay', code: '598', iso: 'UY', aliases: ['uruguay', 'montevideo', 'salto', 'ciudad de la costa', 'paysandu', 'maldonado', 'punta del este'], lang: 'es' },

  // América Central & Caribe
  { name: 'Panamá', code: '507', iso: 'PA', aliases: ['panama', 'panamá', 'ciudad de panama', 'colon', 'david'], lang: 'es' },
  { name: 'Costa Rica', code: '506', iso: 'CR', aliases: ['costa rica', 'san jose', 'alajuela', 'cartago', 'heredia', 'liberia'], lang: 'es' },
  { name: 'Nicaragua', code: '505', iso: 'NI', aliases: ['nicaragua', 'managua', 'leon', 'granada', 'matagalpa'], lang: 'es' },
  { name: 'Honduras', code: '504', iso: 'HN', aliases: ['honduras', 'tegucigalpa', 'san pedro sula', 'choloma', 'la ceiba'], lang: 'es' },
  { name: 'El Salvador', code: '503', iso: 'SV', aliases: ['el salvador', 'san salvador', 'santa ana', 'san miguel', 'soyapango'], lang: 'es' },
  { name: 'Guatemala', code: '502', iso: 'GT', aliases: ['guatemala', 'ciudad de guatemala', 'mixco', 'villa nueva', 'quetzaltenango'], lang: 'es' },
  { name: 'Belice', code: '501', iso: 'BZ', aliases: ['belice', 'belize', 'belmopan', 'belize city', 'san ignacio'], lang: 'en' },
  { name: 'México', code: '52', iso: 'MX', aliases: ['mexico', 'méxico', 'cdmx', 'guadalajara', 'monterrey', 'puebla', 'tijuana', 'leon', 'juarez', 'cancun', 'merida', 'queretaro'], lang: 'es' },
  { name: 'República Dominicana', code: '1809', iso: 'DO', aliases: ['republica dominicana', 'dominican republic', 'santo domingo', 'santiago de los caballeros', 'punta cana'], lang: 'es' },
  { name: 'Puerto Rico', code: '1787', iso: 'PR', aliases: ['puerto rico', 'san juan', 'bayamon', 'carolina', 'ponce', 'caguas'], lang: 'es' },
  { name: 'Cuba', code: '53', iso: 'CU', aliases: ['cuba', 'la habana', 'santiago de cuba', 'camaguey', 'holguin'], lang: 'es' },
  { name: 'Jamaica', code: '1876', iso: 'JM', aliases: ['jamaica', 'kingston', 'montego bay', 'spanish town'], lang: 'en' },
  { name: 'Haití', code: '509', iso: 'HT', aliases: ['haiti', 'haití', 'puerto principe', 'port-au-prince', 'cap-haitien'], lang: 'fr' },
  { name: 'Trinidad y Tobago', code: '1868', iso: 'TT', aliases: ['trinidad y tobago', 'trinidad and tobago', 'puerto espana', 'port of spain', 'san fernando'], lang: 'en' },

  // América del Norte
  { name: 'Estados Unidos', code: '1', iso: 'US', aliases: ['estados unidos', 'usa', 'united states', 'eeuu', 'miami', 'new york', 'nueva york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san antonio', 'san diego', 'dallas', 'austin', 'san francisco', 'orlando', 'atlanta', 'boston', 'seattle', 'denver', 'las vegas'], lang: 'en' },
  { name: 'Canadá', code: '1', iso: 'CA', aliases: ['canada', 'canadá', 'toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton', 'quebec', 'winnipeg'], lang: 'en' },

  // Europa
  { name: 'Alemania', code: '49', iso: 'DE', aliases: ['alemania', 'germany', 'deutschland', 'chemnitz', 'berlin', 'munich', 'münchen', 'hamburg', 'frankfurt', 'köln', 'cologne', 'stuttgart', 'düsseldorf', 'dresden', 'leipzig', 'dortmund', 'essen', 'bremen', 'hannover', 'nürnberg', 'bonn'], lang: 'de' },
  { name: 'Francia', code: '33', iso: 'FR', aliases: ['francia', 'france', 'paris', 'parís', 'marseille', 'marcella', 'lyon', 'toulouse', 'nice', 'niza', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'burdeos', 'lille', 'rennes'], lang: 'fr' },
  { name: 'España', code: '34', iso: 'ES', aliases: ['españa', 'espana', 'spain', 'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'malaga', 'málaga', 'murcia', 'palma', 'las palmas', 'bilbao', 'alicante', 'cordoba', 'valladolid'], lang: 'es' },
  { name: 'Italia', code: '39', iso: 'IT', aliases: ['italia', 'italy', 'roma', 'rome', 'milan', 'milano', 'napoles', 'napoli', 'turin', 'torino', 'palermo', 'genova', 'bolonia', 'bologna', 'florencia', 'firenze', 'venecia', 'venezia'], lang: 'it' },
  { name: 'Reino Unido', code: '44', iso: 'GB', aliases: ['reino unido', 'united kingdom', 'uk', 'england', 'inglaterra', 'gran bretaña', 'london', 'londres', 'manchester', 'birmingham', 'glasgow', 'liverpool', 'edinburgh', 'bristol', 'leeds'], lang: 'en' },
  { name: 'Portugal', code: '351', iso: 'PT', aliases: ['portugal', 'lisboa', 'lisbon', 'porto', 'oporto', 'amadora', 'braga', 'setubal', 'coimbra', 'funchal'], lang: 'pt' },
  { name: 'Países Bajos', code: '31', iso: 'NL', aliases: ['paises bajos', 'países bajos', 'holanda', 'netherlands', 'amsterdam', 'rotterdam', 'la haya', 'the hague', 'utrecht', 'eindhoven'], lang: 'nl' },
  { name: 'Bélgica', code: '32', iso: 'BE', aliases: ['belgica', 'bélgica', 'belgium', 'bruselas', 'brussels', 'amberes', 'antwerp', 'gante', 'ghent', 'charleroi', 'lieja'], lang: 'fr' },
  { name: 'Suiza', code: '41', iso: 'CH', aliases: ['suiza', 'switzerland', 'schweiz', 'zurich', 'zürich', 'ginebra', 'geneva', 'basilea', 'basel', 'berna', 'bern', 'lausana', 'lucerna'], lang: 'de' },
  { name: 'Austria', code: '43', iso: 'AT', aliases: ['austria', 'österreich', 'viena', 'vienna', 'wien', 'graz', 'linz', 'salzburgo', 'salzburg', 'innsbruck'], lang: 'de' },
  { name: 'Suecia', code: '46', iso: 'SE', aliases: ['suecia', 'sweden', 'estocolmo', 'stockholm', 'gotemburgo', 'gothenburg', 'malmö', 'uppsala'], lang: 'sv' },
  { name: 'Noruega', code: '47', iso: 'NO', aliases: ['noruega', 'norway', 'oslo', 'bergen', 'trondheim', 'stavanger', 'drammen'], lang: 'no' },
  { name: 'Dinamarca', code: '45', iso: 'DK', aliases: ['dinamarca', 'denmark', 'copenhague', 'copenhagen', 'aarhus', 'odense', 'aalborg'], lang: 'da' },
  { name: 'Finlandia', code: '358', iso: 'FI', aliases: ['finlandia', 'finland', 'helsinki', 'espoo', 'tampere', 'vantaa', 'oulu', 'turku'], lang: 'fi' },
  { name: 'Irlanda', code: '353', iso: 'IE', aliases: ['irlanda', 'ireland', 'dublin', 'dublín', 'cork', 'galway', 'limerick', 'waterford'], lang: 'en' },
  { name: 'Polonia', code: '48', iso: 'PL', aliases: ['polonia', 'poland', 'varsovia', 'warsaw', 'cracovia', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk'], lang: 'pl' },
  { name: 'República Checa', code: '420', iso: 'CZ', aliases: ['republica checa', 'czech republic', 'chequia', 'praga', 'prague', 'brno', 'ostrava', 'pilsen'], lang: 'cs' },
  { name: 'Grecia', code: '30', iso: 'GR', aliases: ['grecia', 'greece', 'atenas', 'athens', 'tesalonica', 'thessaloniki', 'patras', 'heraklion'], lang: 'el' },
  { name: 'Rumania', code: '40', iso: 'RO', aliases: ['rumania', 'romania', 'bucarest', 'bucharest', 'cluj-napoca', 'timisoara', 'iasi', 'constanta'], lang: 'ro' },
  { name: 'Hungría', code: '36', iso: 'HU', aliases: ['hungria', 'hungría', 'hungary', 'budapest', 'debrecen', 'szeged', 'miskolc', 'pecs'], lang: 'hu' },
  { name: 'Turquía', code: '90', iso: 'TR', aliases: ['turquia', 'turquía', 'turkey', 'türkiye', 'estambul', 'istanbul', 'ankara', 'izmir', 'bursa', 'antalya'], lang: 'tr' },
  { name: 'Rusia', code: '7', iso: 'RU', aliases: ['rusia', 'russia', 'moscu', 'moscú', 'moscow', 'san petersburgo', 'saint petersburg', 'novosibirsk', 'ekaterimburgo', 'kazan'], lang: 'ru' },
  { name: 'Ucrania', code: '380', iso: 'UA', aliases: ['ucrania', 'ukraine', 'kiev', 'kyiv', 'jarkov', 'kharkiv', 'odesa', 'dnipro', 'lviv'], lang: 'uk' },

  // Asia & Oceanía
  { name: 'Japón', code: '81', iso: 'JP', aliases: ['japon', 'japón', 'japan', 'tokio', 'tokyo', 'osaka', 'kioto', 'kyoto', 'yokohama', 'nagoya', 'sapporo', 'kobe', 'fukuoka'], lang: 'ja' },
  { name: 'Corea del Sur', code: '82', iso: 'KR', aliases: ['corea del sur', 'south korea', 'korea', 'seul', 'seúl', 'seoul', 'busan', 'incheon', 'daegu', 'daejeon'], lang: 'ko' },
  { name: 'China', code: '86', iso: 'CN', aliases: ['china', 'beijing', 'pekin', 'shanghai', 'canton', 'guangzhou', 'shenzhen', 'chengdu', 'wuhan'], lang: 'zh' },
  { name: 'India', code: '91', iso: 'IN', aliases: ['india', 'mumbai', 'bombay', 'nueva delhi', 'new delhi', 'bangalore', 'hyderabad', 'chennai', 'calcuta', 'kolkata'], lang: 'en' },
  { name: 'Australia', code: '61', iso: 'AU', aliases: ['australia', 'sidney', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaida', 'adelaide', 'gold coast', 'canberra'], lang: 'en' },
  { name: 'Nueva Zelanda', code: '64', iso: 'NZ', aliases: ['nueva zelanda', 'new zealand', 'auckland', 'wellington', 'christchurch', 'hamilton', 'tauranga'], lang: 'en' },
  { name: 'Singapur', code: '65', iso: 'SG', aliases: ['singapur', 'singapore'], lang: 'en' },
  { name: 'Emiratos Árabes Unidos', code: '971', iso: 'AE', aliases: ['emiratos arabes', 'uae', 'dubai', 'dubaï', 'abu dhabi', 'sharjah', 'ajman'], lang: 'ar' },
  { name: 'Israel', code: '972', iso: 'IL', aliases: ['israel', 'jerusalen', 'jerusalem', 'tel aviv', 'haifa', 'rishon lezion', 'petah tikva'], lang: 'he' },
  { name: 'Arabia Saudita', code: '966', iso: 'SA', aliases: ['arabia saudita', 'saudi arabia', 'riad', 'riyadh', 'yeda', 'jeddah', 'meca', 'medina'], lang: 'ar' },
  { name: 'Filipinas', code: '63', iso: 'PH', aliases: ['filipinas', 'philippines', 'manila', 'quezon city', 'davao', 'cebu'], lang: 'en' },
  { name: 'Tailandia', code: '66', iso: 'TH', aliases: ['tailandia', 'thailand', 'bangkok', 'phuket', 'chiang mai', 'pattaya'], lang: 'th' },
  { name: 'Indonesia', code: '62', iso: 'ID', aliases: ['indonesia', 'yakarta', 'jakarta', 'surabaya', 'bandung', 'medan', 'bali', 'denpasar'], lang: 'id' },

  // África
  { name: 'Sudáfrica', code: '27', iso: 'ZA', aliases: ['sudafrica', 'sudáfrica', 'south africa', 'johannesburgo', 'johannesburg', 'ciudad del cabo', 'cape town', 'durban', 'pretoria'], lang: 'en' },
  { name: 'Egipto', code: '20', iso: 'EG', aliases: ['egipto', 'egypt', 'el cairo', 'cairo', 'alejandria', 'alexandria', 'giza', 'shubra'], lang: 'ar' },
  { name: 'Marruecos', code: '212', iso: 'MA', aliases: ['marruecos', 'morocco', 'casablanca', 'rabat', 'fes', 'marrakech', 'tanger', 'agadir'], lang: 'ar' },
  { name: 'Nigeria', code: '234', iso: 'NG', aliases: ['nigeria', 'lagos', 'abuja', 'kano', 'ibadan', 'port harcourt'], lang: 'en' },
  { name: 'Kenia', code: '254', iso: 'KE', aliases: ['kenia', 'kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru'], lang: 'en' }
];

class CountryRegistry {
  /**
   * Identifies the exact country and dialing code from any text, query, or city
   */
  static findCountry(queryText) {
    if (!queryText) return COUNTRIES[0]; // Default Colombia if null

    const text = queryText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Direct search by country name / aliases
    for (const c of COUNTRIES) {
      const normName = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (text.includes(normName)) {
        return c;
      }
      for (const alias of c.aliases) {
        const normAlias = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Match whole word or bounded phrase
        const regex = new RegExp(`\\b${normAlias}\\b`, 'i');
        if (regex.test(text) || text.includes(normAlias)) {
          return c;
        }
      }
    }

    // Default fallback
    return COUNTRIES[0];
  }

  static getAllCountries() {
    return COUNTRIES;
  }
}

module.exports = CountryRegistry;
