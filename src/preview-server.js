/**
 * PREVIEW SERVER
 * Express server providing instant local & tunnel access to generated landing pages,
 * video assets, and webhook status endpoints.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const configManager = require('./config-manager');

class PreviewServer {
  constructor() {
    this.app = express();
    this.port = configManager.get('serverPort', 3000);
    this.sitesDir = path.join(__dirname, '..', 'generated_sites');
    this.videosDir = path.join(__dirname, '..', 'generated_videos');
    this.screenshotsDir = path.join(__dirname, '..', 'generated_screenshots');
    this.serverInstance = null;

    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.json());

    // Serve static video & screenshot assets
    if (!fs.existsSync(this.videosDir)) fs.mkdirSync(this.videosDir, { recursive: true });
    this.app.use('/videos', express.static(this.videosDir));

    if (!fs.existsSync(this.screenshotsDir)) fs.mkdirSync(this.screenshotsDir, { recursive: true });
    this.app.use('/screenshots', express.static(this.screenshotsDir));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'ALARICUS B2B Swarm Server (v2.0.0)',
        modules: ['Web Directa', 'VAREGO Social & Ads']
      });
    });

    // Real-time Pipeline Dashboard
    this.app.get('/dashboard', (req, res) => {
      const leadDatabase = require('./lead-database');
      const sessionManager = require('./session-manager');
      const stats = leadDatabase.getStats();
      const sessStats = sessionManager.getGlobalStats();
      const leads = leadDatabase.data.leads || [];

      const leadsRows = leads.slice(-20).reverse().map(l => `
        <tr class="border-b border-slate-800 hover:bg-slate-800/40">
          <td class="p-3 font-semibold text-white">${l.company_name}</td>
          <td class="p-3 text-xs">
            <span class="px-2 py-1 rounded-full ${l.lead_route === 'RUTA_C_VAREGO' ? 'bg-pink-950 text-pink-300 border border-pink-700' : 'bg-indigo-950 text-indigo-300 border border-indigo-700'} font-bold">
              ${l.lead_route}
            </span>
          </td>
          <td class="p-3 text-xs text-slate-300">${l.location?.city || '-'}</td>
          <td class="p-3 font-mono text-xs text-amber-300">${l.diagnostics?.lead_score || 50}/100</td>
          <td class="p-3 font-mono text-xs text-emerald-400">$${l.diagnostics?.mrr_potential_usd || (l.lead_route === "RUTA_C_VAREGO" ? 100 : 0)} USD</td>
          <td class="p-3 text-xs">
            <a href="${l.assets?.landing_page_url || '#'}" target="_blank" class="text-sky-400 hover:underline">Ver Demo ↗</a>
          </td>
          <td class="p-3 text-xs">
            <span class="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">${l.pipeline_status}</span>
          </td>
        </tr>
      `).join('\n');

      res.send(`
        <!DOCTYPE html>
        <html class="dark">
        <head>
          <title>ALARICUS B2B Swarm Dashboard</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
          <div class="max-w-6xl mx-auto space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 class="text-2xl font-black tracking-tight text-white">⚔️ ALARICUS B2B Swarm Dashboard</h1>
                <p class="text-xs text-slate-400 mt-0.5">Control de Prospección Agéntica • Web Directa + VAREGO Social & Ads ($100/mo)</p>
              </div>
              <span class="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold">● Swarm Activo</span>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <p class="text-xs text-slate-400 font-bold uppercase">Total Leads</p>
                <p class="text-2xl font-black text-white mt-1">${stats.totalLeads}</p>
              </div>
              <div class="p-4 rounded-2xl bg-slate-900 border border-pink-900/40">
                <p class="text-xs text-pink-400 font-bold uppercase">VAREGO Leads (Ruta C)</p>
                <p class="text-2xl font-black text-pink-300 mt-1">${stats.routeCCount || 0}</p>
                <p class="text-[11px] text-slate-400 mt-0.5">MRR Potencial: $${(stats.routeCCount || 0) * 100} USD</p>
              </div>
              <div class="p-4 rounded-2xl bg-slate-900 border border-indigo-900/40">
                <p class="text-xs text-indigo-400 font-bold uppercase">Web Directa (Rutas A/B)</p>
                <p class="text-2xl font-black text-indigo-300 mt-1">${stats.routeACount + stats.routeBCount}</p>
              </div>
              <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <p class="text-xs text-emerald-400 font-bold uppercase">Pitches Despachados</p>
                <p class="text-2xl font-black text-emerald-300 mt-1">${stats.dispatchedCount}</p>
              </div>
            </div>

            <!-- Leads Table -->
            <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div class="p-4 border-b border-slate-800 font-bold text-sm text-slate-200">
                Últimos Leads Procesados
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead class="bg-slate-800/60 text-xs uppercase text-slate-400">
                    <tr>
                      <th class="p-3">Empresa</th>
                      <th class="p-3">Ruta</th>
                      <th class="p-3">Ciudad</th>
                      <th class="p-3">Score</th>
                      <th class="p-3">MRR Potencial</th>
                      <th class="p-3">Propuesta</th>
                      <th class="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${leadsRows.length > 0 ? leadsRows : '<tr><td colspan="7" class="p-6 text-center text-slate-500">No hay leads registrados aún. Ejecuta un scan con `npm run simulator` o vía WhatsApp.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
    });

    // Dynamic landing page preview route
    this.app.get('/demo/:slug', (req, res) => {
      const slug = req.params.slug;
      const htmlPath = path.join(this.sitesDir, slug, 'index.html');

      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        res.status(404).send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0b0f19; color: white;">
            <h2>Prototipo no encontrado</h2>
            <p>El sitio web o propuesta para el identificador <code>${slug}</code> aún no ha sido generado o ha expirado.</p>
          </div>
        `);
      }
    });

    // Dynamic strategic intelligence dossier route
    this.app.get('/dossier/:slug', (req, res) => {
      const slug = req.params.slug;
      const dossiersDir = path.join(__dirname, '..', 'generated_dossiers');
      const htmlPath = path.join(dossiersDir, slug, 'index.html');

      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        res.status(404).send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #090d16; color: white;">
            <h2>Dossier de Inteligencia no encontrado</h2>
            <p>El diagnóstico estratégico para <code>${slug}</code> no se encuentra en los registros generados.</p>
          </div>
        `);
      }
    });
  }

  start() {
    return new Promise((resolve) => {
      if (this.serverInstance) return resolve(this.port);
      this.serverInstance = this.app.listen(this.port, () => {
        console.log(`[PreviewServer] Live preview server listening on http://localhost:${this.port}`);
        resolve(this.port);
      });
    });
  }

  stop() {
    if (this.serverInstance) {
      this.serverInstance.close();
      this.serverInstance = null;
    }
  }
}

module.exports = new PreviewServer();
