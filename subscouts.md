# 🌐 SUBSCOUTS: Arquitectura Agéntica de Prospección e Inteligencia Territorial Adaptativa

### *Harness de Micro-Agentes Especializados para Descubrimiento Comercial Fidedigno, Verificación Institucional Multijurisdiccional y Adaptabilidad a Cualquier Oferta de Servicios B2B*

---

## 🏛️ 1. Filosofía y Mandato Central

La prospección B2B de alta fidelidad no puede depender de un único motor superficial (como una búsqueda genérica en Google Maps) ni asumir estructuras comerciales uniformes en todo el mundo. Cada país, departamento, estado, municipio y barrio posee:
1. **Fuentes Oficiales Institucionales:** Cámaras de comercio, registros mercantiles centrales, censos empresariales y directorios de industria propios.
2. **Nomenclatura y Jerarquía Territorial:** Barrios, comunas, distritos postales, *arrondissements*, *Kieze*, *boroughs* y cuadrantes catastrales.
3. **Dinámica Sectorial y Normativa:** Códigos de actividad económica (CIIU, CNAE, NAF, NAICS, WZ, ISIC) y exigencias fiscales específicas.
4. **Flexibilidad de Oferta Comercial:** La capacidad de investigar prospectos para **cualquier servicio o producto** (Desarrollo Web, Gestión de Redes, Automatización IA, Software POS/ERP, Consultoría Legal/Tributaria, Logística/Última Milla, Ciberseguridad o Distribución Mayorista).

---

## 🔬 2. Topología de la Red de Subscouts (`src/subscouts/`)

```
                          COORDINADOR MAESTRO (SubscoutCoordinator)
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  GEO_TERRITORY_SUBSCOUT ┃   ┃ INSTITUTIONAL_REGISTRY  ┃   ┃    PUBLIC_DIRECTORY     ┃
┃  (Jerarquía Territorial)┃   ┃       (RUES, RCS,       ┃   ┃ (Páginas Amarillas, IHK,┃
┃  Barrio/Comuna/Kiez/Zip ┃   ┃     Handelsregister)    ┃   ┃  Directorios Sectoriales┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓                                 ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   WEB_FOOTPRINT_SCOUT   ┃                                 ┃ COMMERCIAL_SERVICE_SCOUT┃
┃ (Stack, DNS, SSL, CMS,  ┃                                 ┃ (Adaptación a CUALQUIER ┃
┃   Schema.org, Tráfico)  ┃                                 ┃    Servicio o Nicho)    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛                                 ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🗺️ 3. Mapeo de Fuentes Fidedignas por País y Territorio

| Jurisdicción | Entidad Registral Oficial | Directorios Empresariales y Gremiales | Códigos de Actividad |
| :--- | :--- | :--- | :--- |
| **🇨🇴 Colombia** | • RUES (Registro Único Empresarial y Social)<br>• Cámaras de Comercio Locales (Medellín, Bogotá, Cali, Barranquilla, Bucaramanga)<br>• DIAN | • Directorio Empresarial MinCIT<br>• Páginas Amarillas Colombia<br>• Fenalco | CIIU Rev. 4 (ej. 4752 Ferreterías, 1081 Panaderías, 5611 Restaurantes) |
| **🇩🇪 Alemania** | • Gemeinsames Registerportal der Länder (Handelsregister / Unternehmensregister)<br>• Bundesanzeiger | • IHK (Industrie- und Handelskammer)<br>• Gelbe Seiten / Das Örtliche<br>• Wer liefert was (WLW) | WZ 2008 (Klassifikation der Wirtschaftszweige) |
| **🇫🇷 Francia** | • Registre du Commerce et des Sociétés (RCS)<br>• Base SIRENE (INSEE / data.gouv.fr)<br>• Infogreffe | • PagesJaunes France<br>• CCI France (Chambres de Commerce et d'Industrie)<br>• Kompass France | Code NAF / APE (Nomenclature d'Activités Française) |
| **🇺🇸 Estados Unidos** | • Secretary of State (Divisions of Corporations por Estado: Sunbiz FL, NY DOS, CA BizFile)<br>• OpenCorporates | • Better Business Bureau (BBB)<br>• YellowPages US<br>• ThomasNet (B2B Industrial) | NAICS (North American Industry Classification System) / SIC |
| **🇬🇾 Guyana** | • Deeds and Commercial Registry Authority (DCRA)<br>• Guyana Revenue Authority (GRA) | • Guyana Yellow Pages<br>• Georgetown Chamber of Commerce & Industry (GCCI) | ISIC Rev. 4 |
| **🇪🇸 España** | • Registro Mercantil Central (Colegio de Registradores)<br>• BORME (Boletín Oficial del Registro Mercantil) | • Directorio Einforma / Axesor<br>• Páginas Amarillas España<br>• Cámaras de Comercio de España | CNAE 2009 (Clasificación Nacional de Actividades Económicas) |
| **🇧🇷 Brasil** | • Receita Federal do Brasil (Cadastro Nacional da Pessoa Jurídica - CNPJ)<br>• Juntas Comerciais (JUCESP, JUCERJA) | • Telelistas Brasil<br>• Apontador / Guiamais<br>• SEBRAE | CNAE Brasil (Classificação Nacional de Atividades Econômicas) |
| **🇬🇧 Reino Unido** | • Companies House (Gov.uk Register API)<br>• London Gazette | • Yell.com<br>• British Chambers of Commerce<br>• 192.com | UK SIC 2007 (Standard Industrial Classification) |
| **🇲🇽 México** | • Secretaría de Economía (RPC - Registro Público de Comercio)<br>• SAT (RFC Verificación) | • SIEM (Sistema de Información Empresarial Mexicano)<br>• Sección Amarilla México | SCIAN (Sistema de Clasificación Industrial de América del Norte) |

---

## 💼 4. Matriz de Adaptabilidad a Cualquier Oferta Comercial (`CommercialServiceAdapter`)

El enjambre de Subscouts evalúa y diagnostica a los prospectos de acuerdo con el **servicio comercial específico** configurado por el operador:

1. **🌐 Desarrollo Web & Catálogo Directo:** Evalúa vacancia digital, lentitud de carga, falta de botón directo de WhatsApp y comisiones de intermediarios.
2. **📱 Gestión de Redes Sociales & Meta Ads (VAREGO):** Evalúa abandono de Instagram/Facebook (>20 días sin posts) y ausencia de biblioteca de anuncios activa en Meta Ads.
3. **🤖 Automatización de Procesos & Agentes IA:** Evalúa tiempos muertos de respuesta en WhatsApp/Google Maps, agendamiento manual de citas y pérdida de leads fuera de horario.
4. **💻 Software de Gestión POS / ERP:** Evalúa negocios con alto volumen de inventario y referencias físicas (ferreterías, minimercados, droguerías) sin cotizador digital sincronizado.
5. **⚖️ Consultoría Legal, Tributaria & Cumplimiento:** Cruza tipo de persona (Natural vs Jurídica S.A.S.), antigüedad y cambios registrales para ofrecer formalización o auditoría.
6. **🚚 Logística & Última Milla:** Identifica establecimientos con alta demanda de despachos locales que dependen de flotas externas costosas.
7. **🔒 Ciberseguridad & Protección de Datos:** Detecta sitios sin HTTPS/SSL, puertos expuestos o formularios sin políticas de tratamiento de datos (Habeas Data / RGPD).

---

## ⚡ 5. Protocolo de Ejecución de un Subscout

1. **Recepción del Input:** Parsea texto libre, geolocalización o parámetros formales (ej. `Ferreterías en el barrio La Milagrosa de Medellín`).
2. **Despliegue de `GeoTerritorySubscout`:** Identifica que *La Milagrosa* es un barrio de la Comuna 9 (Buenos Aires) de Medellín, Antioquia, Colombia (CO / `+57`).
3. **Despliegue de `InstitutionalRegistrySubscout`:** Enruta la verificación hacia la Cámara de Comercio de Medellín para Antioquia y el RUES, mapeando el CIIU `4752`.
4. **Despliegue de `PublicDirectorySubscout`:** Cruza con directorios locales y Google Maps para compilar teléfonos fidedignos, reseñas y horarios.
5. **Despliegue de `WebFootprintSubscout`:** Realiza análisis forense del dominio y determina la madurez digital.
6. **Despliegue de `CommercialServiceAdapter`:** Formula el dolor exacto según el servicio seleccionado y calcula el ROI proyectado.
7. **Generación del Dossier Consolidado:** Emite el diagnóstico estructurado listo para consulta humana o despacho autónomo.


## 🛡️ 6. Los 5 Motores de Curaduría y Arbitraje de Verdad
1. **EntityDeduplicator:** Desduplicación difusa y agrupación de variantes comerciales.
2. **SourceArbitrator:** Jerarquía ponderada de fuentes.
3. **GeoFenceCurator:** Geocercado estricto de barrio.
4. **LivenessProbe:** Sonda en vivo de WhatsApp y recency decay.
5. **DataProvenanceLedger:** Trazabilidad de procedencia y sello criptográfico de verdad.
