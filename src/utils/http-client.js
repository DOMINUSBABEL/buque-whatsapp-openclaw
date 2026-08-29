/**
 * RESILIENT HTTP CLIENT
 * Provides unified HTTP requesting with rate-limiting, exponential backoff,
 * jitter, and latency measurement.
 */
const axios = require('axios');

class HttpClient {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.initialBackoffMs = options.initialBackoffMs || 1000;
    this.timeoutMs = options.timeoutMs || 8000;
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  }

  async request(config) {
    const timeout = config.timeout || this.timeoutMs;
    const maxRetries = config.maxRetries !== undefined ? config.maxRetries : this.maxRetries;
    const fullConfig = {
      timeout,
      headers: {
        'User-Agent': this.userAgent,
        ...(config.headers || {})
      },
      ...config
    };

    let attempt = 0;
    while (attempt < maxRetries) {
      const startTime = Date.now();
      try {
        const response = await axios(fullConfig);
        const duration = Date.now() - startTime;
        return {
          status: response.status,
          data: response.data,
          headers: response.headers,
          durationMs: duration
        };
      } catch (err) {
        attempt++;
        const duration = Date.now() - startTime;
        if (attempt >= this.maxRetries) {
          throw new Error(`HTTP request failed after ${attempt} attempts: ${err.message} (${duration}ms)`);
        }
        const backoff = this.initialBackoffMs * Math.pow(2, attempt - 1) + Math.random() * 500;
        await new Promise(res => setTimeout(res, backoff));
      }
    }
  }

  async get(url, headers = {}, options = {}) {
    return this.request({ method: 'GET', url, headers, ...options });
  }

  async head(url, headers = {}, options = {}) {
    return this.request({ method: 'HEAD', url, headers, ...options });
  }

  async post(url, data, headers = {}, options = {}) {
    return this.request({ method: 'POST', url, data, headers, ...options });
  }
}

module.exports = new HttpClient();
