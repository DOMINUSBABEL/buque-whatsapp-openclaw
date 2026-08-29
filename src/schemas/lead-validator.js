/**
 * LEAD VALIDATOR
 * Enforces the LeadSwarmPayload specification across agent boundaries.
 */
class LeadValidator {
  static validate(lead) {
    const errors = [];

    if (!lead) {
      return { valid: false, errors: ['Lead object is null or undefined'] };
    }

    if (!lead.lead_id || typeof lead.lead_id !== 'string') {
      errors.push('Invalid or missing lead_id');
    }

    if (!lead.company_name || typeof lead.company_name !== 'string' || lead.company_name.trim().length === 0) {
      errors.push('company_name is required');
    }

    if (!lead.location || !lead.location.city || !lead.location.country) {
      errors.push('location.city and location.country are required');
    }

    if (!lead.contact_channel || !lead.contact_channel.primary_type) {
      errors.push('contact_channel.primary_type is required');
    }

    if (lead.contact_channel && lead.contact_channel.phone_e164) {
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      if (!e164Regex.test(lead.contact_channel.phone_e164)) {
        errors.push(`phone_e164 '${lead.contact_channel.phone_e164}' does not match E.164 format`);
      }
    }

    if (!['RUTA_A', 'RUTA_B'].includes(lead.lead_route)) {
      errors.push(`lead_route must be RUTA_A or RUTA_B, received: ${lead.lead_route}`);
    }

    if (!lead.scout_metadata) {
      errors.push('scout_metadata is required');
    } else {
      if (typeof lead.scout_metadata.has_website !== 'boolean') {
        errors.push('scout_metadata.has_website must be boolean');
      }
      if (typeof lead.scout_metadata.reviews_count !== 'number' || lead.scout_metadata.reviews_count < 0) {
        errors.push('scout_metadata.reviews_count must be non-negative integer');
      }
      if (typeof lead.scout_metadata.rating !== 'number' || lead.scout_metadata.rating < 1.0 || lead.scout_metadata.rating > 5.0) {
        errors.push('scout_metadata.rating must be between 1.0 and 5.0');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static assertValid(lead) {
    const result = this.validate(lead);
    if (!result.valid) {
      throw new Error(`[LeadValidator Error] Contract violation: ${result.errors.join('; ')}`);
    }
    return lead;
  }
}

module.exports = LeadValidator;
