/**
 * DIAGNOSER ENGINE
 * Formulates commercial pain points, computes multi-factor lead scores (1-100),
 * and selects the top high-priority leads for full asset generation.
 */
class DiagnoserEngine {
  /**
   * Evaluates a qualified lead and produces score + diagnostic payload
   */
  diagnoseLead(leadPayload) {
    const { scout_metadata, lead_route, company_name } = leadPayload;
    const reviews = scout_metadata.reviews_count || 0;
    const rating = scout_metadata.rating || 4.0;
    const hasPhone = !!leadPayload.contact_channel?.phone_e164;

    let score = 50;

    // Volume weight: More reviews = more commercial activity
    if (reviews >= 50) score += 20;
    else if (reviews >= 20) score += 15;
    else if (reviews >= 5) score += 10;

    // Route weight
    if (lead_route === 'RUTA_A') {
      score += 15; // Primary priority for Web
    } else if (lead_route === 'RUTA_B') {
      // If rating is lower, pain is sharper
      if (rating <= 3.5) score += 20;
      else if (rating <= 3.9) score += 10;
      if (scout_metadata.friction_keywords_found?.length > 0) score += 10;
    } else if (lead_route === 'RUTA_C_VAREGO') {
      score += 20; // High conversion potential for monthly recurring retainer
      if (scout_metadata.social_audit?.social_dormant) score += 10;
      if (!scout_metadata.social_audit?.active_meta_ads) score += 5;
    }

    // Direct WhatsApp channel accessibility
    if (hasPhone) score += 10;

    score = Math.min(100, Math.max(1, score));

    // Formulate core pain hook
    let corePainHook = '';
    if (lead_route === 'RUTA_A') {
      corePainHook = `Actualmente ${company_name} tiene ${reviews} reseñas en Google pero carece de un canal web directo para captar pedidos y clientes móviles sin intermediarios.`;
    } else if (lead_route === 'RUTA_B') {
      corePainHook = `Clientes de ${company_name} reportan fricciones directas en su canal web (${scout_metadata.friction_snippet || 'fallas en navegación/menú'}).`;
    } else if (lead_route === 'RUTA_C_VAREGO') {
      const days = scout_metadata.social_audit?.last_post_days_ago || 'varias semanas';
      corePainHook = `Alta demanda comprobada (${reviews} opiniones) pero sus redes sociales llevan ${days} días sin publicaciones estratégicas ni campañas de pauta Meta Ads activas.`;
    }

    return {
      lead_score: score,
      high_priority: false, // Set dynamically by orchestrator for top 3-5
      core_pain_hook: corePainHook,
      service_offer: lead_route === 'RUTA_C_VAREGO' ? 'VAREGO_SOCIAL_ADS' : 'DIRECT_WEB'
    };
  }
}

module.exports = new DiagnoserEngine();
