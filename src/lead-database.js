/**
 * LEAD DATABASE
 * Local JSON persistence engine with deduplication indexing by phone,
 * place_id, and slug to prevent redundant outreach.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'leads_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LeadDatabase {
  constructor() {
    this.data = {
      leads: [],
      indexedPhones: {},
      indexedPlaceIds: {}
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn(`[LeadDatabase] Failed to load DB: ${err.message}. Initializing empty.`);
      this.data = { leads: [], indexedPhones: {}, indexedPlaceIds: {} };
    }
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error(`[LeadDatabase] Error saving DB: ${err.message}`);
    }
  }

  isDuplicate(phoneE164, placeId = null) {
    if (phoneE164 && this.data.indexedPhones[phoneE164]) {
      return true;
    }
    if (placeId && this.data.indexedPlaceIds[placeId]) {
      return true;
    }
    return false;
  }

  insertLead(lead) {
    if (this.isDuplicate(lead.contact_channel?.phone_e164, lead.location?.maps_place_id)) {
      return false;
    }

    this.data.leads.push(lead);
    if (lead.contact_channel?.phone_e164) {
      this.data.indexedPhones[lead.contact_channel.phone_e164] = lead.lead_id;
    }
    if (lead.location?.maps_place_id) {
      this.data.indexedPlaceIds[lead.location.maps_place_id] = lead.lead_id;
    }
    this.save();
    return true;
  }

  updateLead(leadId, updates) {
    const lead = this.data.leads.find(l => l.lead_id === leadId);
    if (lead) {
      Object.assign(lead, updates, { updated_at: new Date().toISOString() });
      this.save();
      return lead;
    }
    return null;
  }

  getLeadById(leadId) {
    return this.data.leads.find(l => l.lead_id === leadId) || null;
  }

  getLeadsByStatus(status) {
    return this.data.leads.filter(l => l.pipeline_status === status);
  }

  getStats() {
    return {
      totalLeads: this.data.leads.length,
      routeACount: this.data.leads.filter(l => l.lead_route === 'RUTA_A').length,
      routeBCount: this.data.leads.filter(l => l.lead_route === 'RUTA_B').length,
      routeCCount: this.data.leads.filter(l => l.lead_route === 'RUTA_C_VAREGO').length,
      highPriorityCount: this.data.leads.filter(l => l.diagnostics?.high_priority).length,
      dispatchedCount: this.data.leads.filter(l => l.pipeline_status === 'IN_OUTREACH' || l.pipeline_status === 'CONVERTED').length
    };
  }

  purge() {
    this.data = {
      leads: [],
      indexedPhones: {},
      indexedPlaceIds: {}
    };
    this.save();
  }
}

module.exports = new LeadDatabase();
