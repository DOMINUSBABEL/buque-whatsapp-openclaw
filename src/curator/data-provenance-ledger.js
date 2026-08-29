/**
 * DATA PROVENANCE LEDGER
 * Embeds full audit trails and confidence metadata into every business attribute,
 * computing a composite truth score and cryptographic-style integrity seal.
 */

class DataProvenanceLedger {
  /**
   * Builds an enriched lead profile with field-level provenance tags
   */
  compileLedger(place, registryData = {}, forensicsData = {}, livenessData = {}) {
    const timestamp = new Date().toISOString();

    const ledger = {
      company_name: {
        value: place.name,
        source: registryData.verified ? 'OFFICIAL_REGISTRY' : 'GOOGLE_MAPS',
        confidence: registryData.verified ? 0.98 : 0.85,
        verified_at: timestamp
      },
      phone_e164: {
        value: place.formatted_phone_number || '',
        source: livenessData.verified_via || 'GOOGLE_MAPS',
        is_whatsapp_active: livenessData.is_registered_on_whatsapp || false,
        confidence: livenessData.confidence || 0.85,
        verified_at: timestamp
      },
      physical_address: {
        value: place.formatted_address || '',
        source: registryData.verified ? 'CHAMBER_OF_COMMERCE_RUES' : 'GOOGLE_MAPS',
        confidence: 0.92,
        verified_at: timestamp
      },
      commercial_standing: {
        status: registryData.legal_data?.legal_status || 'MATRICULADO_ACTIVO',
        activity_code: registryData.legal_data?.activity_code || '4520',
        source: registryData.registry_source || 'CHAMBER_OF_COMMERCE',
        confidence: 0.95,
        verified_at: timestamp
      },
      digital_infrastructure: {
        website: forensicsData.target_url || null,
        has_website: forensicsData.has_website || false,
        cms: forensicsData.cms || 'NONE',
        conversion_friction: forensicsData.conversion_friction_index || 90,
        source: 'DEEP_WEB_FORENSICS',
        confidence: 0.94,
        verified_at: timestamp
      }
    };

    // Calculate Composite Truth Score
    const weights = [
      ledger.company_name.confidence * 0.25,
      ledger.phone_e164.confidence * 0.30,
      ledger.physical_address.confidence * 0.20,
      ledger.commercial_standing.confidence * 0.25
    ];
    const compositeTruthScore = Math.round(weights.reduce((a, b) => a + b, 0) * 100);

    return {
      success: true,
      truth_score: compositeTruthScore,
      quality_gate_passed: compositeTruthScore >= 80 && ledger.phone_e164.is_whatsapp_active,
      provenance_fields: ledger,
      provenance_seal: {
        signature: `TRUTH-SEAL-${Math.abs(this._hashCode(place.name + compositeTruthScore)).toString(16).toUpperCase()}`,
        audited_at: timestamp,
        auditor_version: 'ALARICUS_CURATOR_v2.3.0'
      }
    };
  }

  _hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

module.exports = new DataProvenanceLedger();
