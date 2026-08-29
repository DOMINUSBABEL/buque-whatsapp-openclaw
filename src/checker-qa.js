/**
 * CHECKER QA (GATEKEEPER)
 * Strict middleware inspection before any external dispatch.
 * Enforces:
 * 1. Syntax & Placeholders check (No {{var}}, null, undefined)
 * 2. Recipient verification (E.164 phone format and/or MX domain)
 * 3. Route & Copy coherence check
 */
const dns = require('dns').promises;
const configManager = require('./config-manager');
const linkVerifier = require('./link-verifier');

class CheckerQA {
  constructor() {
    this.strictE164 = configManager.get('qaSettings.strictE164Validation', true);
    this.requireMx = configManager.get('qaSettings.requireMxValidation', false);
  }

  async validateLead(lead) {
    const inspections = {
      syntax_and_placeholders_valid: true,
      urls_http_200_under_1500ms: true,
      recipient_identity_valid: true,
      route_copy_coherence: true
    };
    const failureReasons = [];

    // 1. SYNTAX & PLACEHOLDER CHECK
    const copies = lead.diagnostics?.channel_copies || {};
    const textsToCheck = [
      copies.whatsapp || '',
      copies.email?.subject || '',
      copies.email?.body || '',
      copies.instagram_dm || '',
      copies.sms || '',
      lead.diagnostics?.core_pain_hook || ''
    ];

    const placeholderRegex = /{{[\w_]+}}|null|undefined|NaN/i;
    for (const text of textsToCheck) {
      if (placeholderRegex.test(text)) {
        inspections.syntax_and_placeholders_valid = false;
        failureReasons.push(`Unresolved placeholder or invalid token in copy text: "${text.slice(0, 40)}..."`);
        break;
      }
    }

    // 2. RECIPIENT IDENTITY CHECK
    const phone = lead.contact_channel?.phone_e164;
    if (this.strictE164) {
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      if (!phone || !e164Regex.test(phone)) {
        inspections.recipient_identity_valid = false;
        failureReasons.push(`Invalid recipient E.164 phone number: "${phone}"`);
      }
    }

    if (this.requireMx && lead.contact_channel?.email) {
      const domain = lead.contact_channel.email.split('@')[1];
      try {
        const records = await dns.resolveMx(domain);
        if (!records || records.length === 0) {
          inspections.recipient_identity_valid = false;
          failureReasons.push(`Domain has no valid MX records: ${domain}`);
        }
      } catch (err) {
        inspections.recipient_identity_valid = false;
        failureReasons.push(`DNS MX lookup failed for domain: ${domain}`);
      }
    }

    // 3. ROUTE & COPY COHERENCE CHECK
    if (lead.lead_route === 'RUTA_A' && copies.whatsapp && (copies.whatsapp.includes('fallas con su página web') || copies.whatsapp.includes('VAREGO'))) {
      inspections.route_copy_coherence = false;
      failureReasons.push('Route A lead received incorrect route copy');
    }
    if (lead.lead_route === 'RUTA_B' && copies.whatsapp && (copies.whatsapp.includes('no tienen una página web oficial') || copies.whatsapp.includes('VAREGO'))) {
      inspections.route_copy_coherence = false;
      failureReasons.push('Route B lead received incorrect route copy');
    }
    if (lead.lead_route === 'RUTA_C_VAREGO' && copies.whatsapp && (!copies.whatsapp.includes('VAREGO') || !copies.whatsapp.includes('100 USD'))) {
      inspections.route_copy_coherence = false;
      failureReasons.push('Route C VAREGO lead copy missing agency name or $100 USD pricing clause');
    }

    // 4. URL VERIFICATION CHECK
    if (lead.assets?.landing_page_url) {
      const urlCheck = await linkVerifier.verifyUrl(lead.assets.landing_page_url);
      if (!urlCheck.healthy) {
        inspections.urls_http_200_under_1500ms = false;
        failureReasons.push(`Landing page URL unhealthy: ${urlCheck.reason}`);
      }
    }

    const passed = Object.values(inspections).every(val => val === true);

    return {
      passed,
      checked_at: new Date().toISOString(),
      inspections,
      rejection_log: passed ? null : failureReasons.join(' | ')
    };
  }
}

module.exports = new CheckerQA();
