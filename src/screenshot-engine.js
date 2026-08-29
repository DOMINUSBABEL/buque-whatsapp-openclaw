/**
 * SCREENSHOT ENGINE (v2.4.0)
 * Renders high-fidelity mobile-first screenshots of generated landing pages
 * using headless Puppeteer for visual proof and multimedia WhatsApp pitch delivery.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'generated_screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

class ScreenshotEngine {
  constructor() {
    this.screenshotsDir = SCREENSHOTS_DIR;
  }

  /**
   * Captures a mobile-first screenshot of a local landing page file or URL
   * @param {string} sourcePathOrUrl - Local HTML file path or HTTP URL
   * @param {string} slug - Unique identifier for the screenshot filename
   * @param {object} options - Optional overrides (fullPage, viewport, etc.)
   */
  async captureLandingPage(sourcePathOrUrl, slug, options = {}) {
    const filename = `${slug}.png`;
    const outputPath = path.join(this.screenshotsDir, filename);

    let targetUrl = sourcePathOrUrl;
    if (fs.existsSync(sourcePathOrUrl)) {
      const absolutePath = path.resolve(sourcePathOrUrl).replace(/\\/g, '/');
      targetUrl = `file:///${absolutePath}`;
    }

    console.log(`[ScreenshotEngine] 📸 Capturing landing page screenshot: "${targetUrl}"`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote'
        ]
      });

      const page = await browser.newPage();

      // Mobile High-DPI Viewport (iPhone 14 / Pixel 7 aspect ratio)
      await page.setViewport({
        width: 412,
        height: 892,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      });

      // Emulate mobile user agent
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');

      await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: options.timeout || 10000
      });

      // Brief animation settle delay
      await new Promise(r => setTimeout(r, 250));

      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: options.fullPage || false
      });

      console.log(`[ScreenshotEngine] ✅ Screenshot saved successfully -> ${outputPath}`);
      return outputPath;

    } catch (err) {
      console.warn(`[ScreenshotEngine] ⚠️ Puppeteer capture failed: ${err.message}. Generating lightweight SVG fallback.`);
      return this._generateSvgFallback(outputPath, slug);
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          // ignore
        }
      }
    }
  }

  _generateSvgFallback(outputPath, slug) {
    try {
      // In case headless chrome is unavailable in environment, write placeholder image
      const fallbackPngBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(outputPath, fallbackPngBuffer);
      return outputPath;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new ScreenshotEngine();
