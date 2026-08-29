/**
 * COMMERCIAL SERVICE ADAPTER
 * Adapts scouting heuristics, friction diagnostics, value propositions, and ROI models
 * to ANY target commercial service or product offered by the operator.
 */

const SERVICES_REGISTRY = {
  DIRECT_WEB: {
    service_name: 'Desarrollo Web & Catálogo Directo Móvil',
    target_route: 'RUTA_A',
    base_fee_usd: 120,
    core_friction: 'Falta de canal web oficial y pérdida de ventas directas sin comisiones.',
    diagnostic_rubric: (biz, forensics) => {
      if (!forensics.has_website) return { pain: 'Vacancia digital total en Google Search; fuga de clientes hacia agregadores que cobran 20-30% de comisión.', fit_score: 95 };
      if (forensics.conversion_friction_index > 40) return { pain: 'Sitio web lento o sin integración de pedidos a WhatsApp.', fit_score: 80 };
      return { pain: 'Optimización de conversión y catálogo móvil interactivo.', fit_score: 60 };
    }
  },
  VAREGO_SOCIAL_ADS: {
    service_name: 'Gestión de Redes & Campañas Meta Ads (VAREGO)',
    target_route: 'RUTA_C_VAREGO',
    base_fee_usd: 100,
    core_friction: 'Redes sociales dormantes y falta de pauta publicitaria pagada continua.',
    diagnostic_rubric: (biz, forensics, socialAudit) => {
      if (socialAudit?.social_dormant) return { pain: `Canal de Instagram inactivo hace más de ${socialAudit.last_post_days_ago || 30} días sin campañas de Meta Ads activas en el sector.`, fit_score: 95 };
      return { pain: 'Escalamiento de adquisición mensual mediante pauta hiper-local en Meta Ads.', fit_score: 75 };
    }
  },
  AI_AUTOMATION: {
    service_name: 'Agentes de IA para WhatsApp 24/7 & Agendamiento',
    target_route: 'RUTA_AI_AUTOMATION',
    base_fee_usd: 150,
    core_friction: 'Tiempos de respuesta lentos en WhatsApp y pérdida de clientes fuera de horario comercial.',
    diagnostic_rubric: (biz) => {
      return { pain: 'Atención manual lenta en horas pico que genera pérdida del 35% de leads interesados en cotizaciones rápidas.', fit_score: 90 };
    }
  },
  ERP_POS_SOFTWARE: {
    service_name: 'Software POS en la Nube & Control de Inventarios',
    target_route: 'RUTA_ERP_POS',
    base_fee_usd: 80,
    core_friction: 'Control manual de stock, falta de facturación electrónica y descuadres de caja.',
    diagnostic_rubric: (biz) => {
      return { pain: 'Inventario físico desincronizado y cotizaciones manuales lentas en mostrador.', fit_score: 85 };
    }
  },
  LEGAL_TAX_COMPLIANCE: {
    service_name: 'Asesoría Jurídica Empresarial & Formalización',
    target_route: 'RUTA_LEGAL',
    base_fee_usd: 200,
    core_friction: 'Riesgos laborales, contratos comerciales desactualizados y falta de registro de marca.',
    diagnostic_rubric: (biz, forensics, socialAudit, registryData) => {
      return { pain: `Entidad ${registryData.legal_data?.entity_type || 'comercial'} con ${registryData.legal_data?.years_in_business || 2} años requiriendo blindaje contractual y registro de marca.`, fit_score: 85 };
    }
  },
  LOGISTICS_LAST_MILE: {
    service_name: 'Soluciones de Envío & Última Milla Local',
    target_route: 'RUTA_LOGISTICS',
    base_fee_usd: 90,
    core_friction: 'Costos elevados de domicilio por depender de apps de terceros.',
    diagnostic_rubric: () => {
      return { pain: 'Altos costos logísticos por entrega unitaria y falta de ruteo inteligente en el barrio.', fit_score: 80 };
    }
  }
};

class CommercialServiceAdapter {
  /**
   * Adapts the diagnostic assessment to the configured commercial offer
   */
  adaptServiceDiagnostic(serviceKey = 'DIRECT_WEB', businessData = {}, forensicsData = {}, socialAudit = {}, registryData = {}) {
    const key = serviceKey.toUpperCase();
    const serviceDef = SERVICES_REGISTRY[key] || SERVICES_REGISTRY['DIRECT_WEB'];
    const diagnostic = serviceDef.diagnostic_rubric(businessData, forensicsData, socialAudit, registryData);

    return {
      service_key: key,
      service_name: serviceDef.service_name,
      target_route: serviceDef.target_route,
      base_fee_usd: serviceDef.base_fee_usd,
      tailored_pain_hook: diagnostic.pain,
      service_fit_score: diagnostic.fit_score,
      value_proposition: `Implementación de ${serviceDef.service_name} para ${businessData.name || 'el negocio'} en ${businessData.city || 'la ciudad'}.`
    };
  }

  getAvailableServices() {
    return Object.keys(SERVICES_REGISTRY);
  }
}

module.exports = new CommercialServiceAdapter();
