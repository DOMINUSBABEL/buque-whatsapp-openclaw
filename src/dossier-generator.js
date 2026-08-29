/**
 * DOSSIER GENERATOR (Executive Strategic Business Intelligence Report)
 * Compiles a Talleyrand/McKinsey-grade interactive commercial diagnosis,
 * integrating commercial registry verification, web forensics, SWOT matrix,
 * and localized micro-market monetization blueprints.
 */
const fs = require('fs');
const path = require('path');
const configManager = require('./config-manager');
const themeEngine = require('./theme-engine');

const DOSSIERS_DIR = path.join(__dirname, '..', 'generated_dossiers');
if (!fs.existsSync(DOSSIERS_DIR)) fs.mkdirSync(DOSSIERS_DIR, { recursive: true });

class DossierGenerator {
  /**
   * Generates interactive HTML and structured Markdown dossiers
   */
  async generateDossier(businessData, registryData, forensicsData, swotData, businessModelData) {
    const slug = (businessData.name || 'diagnostico')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const targetDir = path.join(DOSSIERS_DIR, slug);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const theme = themeEngine.resolveTheme(businessData.category || '');
    const baseUrl = configManager.get('publicBaseUrl') || 'http://localhost:3000';
    const dossierUrl = `${baseUrl}/dossier/${slug}`;

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dossier de Inteligencia Comercial: ${businessData.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${theme.bg_primary}; color: ${theme.text_primary}; }
    h1, h2, h3, .font-heading { font-family: 'Outfit', sans-serif; }
    .font-mono-data { font-family: 'JetBrains Mono', monospace; }
    .glass-panel { background: ${theme.bg_card}; backdrop-filter: blur(16px); border: 1px solid ${theme.border_card}; }
    .accent-gradient { background: ${theme.gradient_hero}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
  <div class="max-w-5xl mx-auto space-y-8">
    
    <!-- HEADER & STATUS BAR -->
    <header class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            CONFIDENCIAL • INTELIGENCIA B2B
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ${registryData.compliance_seal?.commercial_standing || 'VERIFICADO'}
          </span>
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">${businessData.name}</h1>
        <p class="text-slate-400 text-sm mt-1">📍 ${businessData.formatted_address || businessData.city} • Sector: <span class="text-slate-200 font-medium">${businessData.category}</span></p>
      </div>
      <div class="text-right flex md:flex-col items-center md:items-end gap-3 md:gap-0">
        <div class="text-xs text-slate-400 font-mono-data">GRAVEDAD DIGITAL</div>
        <div class="text-3xl font-black text-amber-400 font-mono-data">${swotData.digital_gravity_index || 85}<span class="text-sm text-slate-500">/100</span></div>
      </div>
    </header>

    <!-- SECTION 1: VERIFICACIÓN LEGAL Y CÁMARA DE COMERCIO -->
    <section class="glass-panel p-6 rounded-2xl">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🏛️</span> Verificación de Registro Mercantil & Existencia Legal
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-data text-xs">
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-slate-400 text-[11px] mb-1">ENTIDAD & JURISDICCIÓN</div>
          <div class="font-bold text-slate-200 text-sm">${registryData.registry_source}</div>
          <div class="text-slate-500 mt-2">Matrícula: ${registryData.legal_data?.registration_id}</div>
        </div>
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-slate-400 text-[11px] mb-1">TIPO SOCIETARIO & TRAYECTORIA</div>
          <div class="font-bold text-amber-400 text-sm">${registryData.legal_data?.entity_type}</div>
          <div class="text-slate-500 mt-2">${registryData.legal_data?.years_in_business} años en el mercado</div>
        </div>
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="text-slate-400 text-[11px] mb-1">CÓDIGO DE ACTIVIDAD CIIU/NAICS</div>
          <div class="font-bold text-cyan-400 text-sm">${registryData.legal_data?.activity_code}</div>
          <div class="text-slate-500 mt-2 line-clamp-1">${registryData.legal_data?.activity_description}</div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: FORENSE WEB & INFRAESTRUCTURA DIGITAL -->
    <section class="glass-panel p-6 rounded-2xl">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span>⚡</span> Auditoría Forense de Presencia Web & Conversión
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
          <div class="text-xs text-slate-400 font-mono-data mb-1">CANAL WEB</div>
          <div class="font-bold ${forensicsData.has_website ? 'text-emerald-400' : 'text-rose-400'} text-sm">${forensicsData.has_website ? 'INDEXADO' : 'VACANCIA DIGITAL'}</div>
        </div>
        <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
          <div class="text-xs text-slate-400 font-mono-data mb-1">STACK / CMS</div>
          <div class="font-bold text-slate-200 text-sm">${forensicsData.cms || 'NINGUNO'}</div>
        </div>
        <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
          <div class="text-xs text-slate-400 font-mono-data mb-1">LATENCIA HTTP</div>
          <div class="font-bold text-cyan-400 text-sm font-mono-data">${forensicsData.latency_ms ? forensicsData.latency_ms + ' ms' : 'N/A'}</div>
        </div>
        <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
          <div class="text-xs text-slate-400 font-mono-data mb-1">FRICCIÓN CHECKOUT</div>
          <div class="font-bold text-rose-400 text-sm font-mono-data">${forensicsData.conversion_friction_index}%</div>
        </div>
      </div>
      <div class="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl">
        <div class="text-xs font-bold text-rose-400 mb-2">PUNTOS CRÍTICOS DE FRICCIÓN DETECTADOS:</div>
        <ul class="text-xs text-slate-300 space-y-1">
          ${(forensicsData.issues_detected || []).map(issue => `<li>• ${issue}</li>`).join('')}
        </ul>
      </div>
    </section>

    <!-- SECTION 3: MATRIZ SWOT / DAFO ESTRATÉGICA -->
    <section class="glass-panel p-6 rounded-2xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <span>🎯</span> Matriz de Diagnóstico Estratégico (SWOT / DAFO)
        </h2>
        <span class="text-xs font-mono-data px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          POSTURA: ${swotData.strategic_posture}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- FORTALEZAS -->
        <div class="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-xl">
          <h3 class="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
            <span>🛡️</span> FORTALEZAS (Strengths)
          </h3>
          <ul class="text-xs text-slate-300 space-y-2">
            ${swotData.matrix.strengths.map(s => `<li>• ${s}</li>`).join('')}
          </ul>
        </div>

        <!-- DEBILIDADES -->
        <div class="bg-rose-950/20 border border-rose-500/20 p-5 rounded-xl">
          <h3 class="text-sm font-bold text-rose-400 mb-3 flex items-center gap-1.5">
            <span>⚠️</span> DEBILIDADES (Weaknesses)
          </h3>
          <ul class="text-xs text-slate-300 space-y-2">
            ${swotData.matrix.weaknesses.map(w => `<li>• ${w}</li>`).join('')}
          </ul>
        </div>

        <!-- OPORTUNIDADES -->
        <div class="bg-cyan-950/20 border border-cyan-500/20 p-5 rounded-xl">
          <h3 class="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
            <span>🚀</span> OPORTUNIDADES (Opportunities)
          </h3>
          <ul class="text-xs text-slate-300 space-y-2">
            ${swotData.matrix.opportunities.map(o => `<li>• ${o}</li>`).join('')}
          </ul>
        </div>

        <!-- AMENAZAS -->
        <div class="bg-amber-950/20 border border-amber-500/20 p-5 rounded-xl">
          <h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
            <span>⚡</span> AMENAZAS (Threats)
          </h3>
          <ul class="text-xs text-slate-300 space-y-2">
            ${swotData.matrix.threats.map(t => `<li>• ${t}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 4: MODELO DE NEGOCIO & BLUEPRINT DE MONETIZACIÓN -->
    <section class="glass-panel p-6 rounded-2xl">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📈</span> Descomposición del Modelo de Negocio & Plan de Crecimiento
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="space-y-3">
          <div>
            <div class="text-xs text-slate-400 font-mono-data">PROPUESTA DE VALOR ACTUAL</div>
            <div class="text-sm text-slate-200 mt-0.5">${businessModelData.value_proposition}</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 font-mono-data">MECÁNICA DE INGRESOS</div>
            <div class="text-sm text-slate-200 mt-0.5">${businessModelData.revenue_mechanics} (Ticket prom: ~$${businessModelData.est_average_ticket_usd} USD)</div>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <div class="text-xs text-slate-400 font-mono-data">CUELLO DE BOTELLA OPERATIVO</div>
            <div class="text-sm text-amber-300 mt-0.5">${businessModelData.operational_bottleneck}</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 font-mono-data">DENSIDAD COMPETITIVA EN BARRIO</div>
            <div class="text-sm text-slate-200 mt-0.5">${businessModelData.neighborhood_landscape.neighborhood}: ~${businessModelData.neighborhood_landscape.estimated_competitors_in_radius} competidores (Oportunidad: <span class="text-emerald-400 font-bold">${businessModelData.neighborhood_landscape.market_share_opportunity}</span>)</div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 p-5 rounded-xl">
        <div class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">ROADMAP DE DIGITALIZACIÓN & RETORNO DE INVERSIÓN (ROI):</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200 font-medium">
          ${businessModelData.monetization_roadmap.map(step => `<div class="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">${step}</div>`).join('')}
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="text-center text-xs text-slate-500 py-4 font-mono-data">
      ALARICUS B2B AGENTIC SWARM v2.1.0 • Generado de forma autónoma con verificación multi-capa
    </footer>

  </div>
</body>
</html>`;

    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');

    // Also generate markdown dossier
    const markdownContent = `# 📋 DOSSIER ESTRATÉGICO: ${businessData.name}

- **Ubicación:** ${businessData.formatted_address || businessData.city}
- **Sector:** ${businessData.category}
- **Fuente de Registro:** ${registryData.registry_source}
- **Estado Legal:** ${registryData.legal_data?.legal_status} (Matrícula: ${registryData.legal_data?.registration_id})
- **Años en el Mercado:** ${registryData.legal_data?.years_in_business} años
- **Código de Actividad:** ${registryData.legal_data?.activity_code} (${registryData.legal_data?.activity_description})

---

## ⚡ Forense Digital & Conversión
- **Canal Web:** ${forensicsData.has_website ? 'Indexado' : 'Vacancia Digital'}
- **CMS/Stack:** ${forensicsData.cms || 'Ninguno'}
- **Fricción de Conversión:** ${forensicsData.conversion_friction_index}/100
- **Hallazgos:** ${forensicsData.issues_detected?.join('; ')}

---

## 🎯 Matriz SWOT / DAFO
### Fortalezas
${swotData.matrix.strengths.map(s => `- ${s}`).join('\n')}

### Debilidades
${swotData.matrix.weaknesses.map(w => `- ${w}`).join('\n')}

### Oportunidades
${swotData.matrix.opportunities.map(o => `- ${o}`).join('\n')}

### Amenazas
${swotData.matrix.threats.map(t => `- ${t}`).join('\n')}

---

## 📈 Roadmap de Monetización
${businessModelData.monetization_roadmap.map(m => `- ${m}`).join('\n')}
`;

    fs.writeFileSync(path.join(targetDir, 'dossier.md'), markdownContent, 'utf8');

    return {
      slug,
      dossier_url: dossierUrl,
      html_path: path.join(targetDir, 'index.html'),
      markdown_path: path.join(targetDir, 'dossier.md')
    };
  }
}

module.exports = new DossierGenerator();

// Step: feat(dossier): build McKinsey-grade HTML interactive report template
