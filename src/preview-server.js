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
    this.serverInstance = null;

    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.json());

    // Serve static video assets
    if (!fs.existsSync(this.videosDir)) fs.mkdirSync(this.videosDir, { recursive: true });
    this.app.use('/videos', express.static(this.videosDir));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Buque B2B Preview Server'
      });
    });

    // Dynamic landing page preview route
    this.app.get('/demo/:slug', (req, res) => {
      const slug = req.params.slug;
      const htmlPath = path.join(this.sitesDir, slug, 'index.html');

      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        res.status(404).send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2>Prototipo no encontrado</h2>
            <p>El sitio web para el identificador <code>${slug}</code> aún no ha sido generado o ha expirado.</p>
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
