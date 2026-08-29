/**
 * ADMIN COMMANDS
 * Intercepts and executes administrative commands issued by authorized operator numbers.
 */
const swarmOrchestrator = require('./swarm-orchestrator');
const leadDatabase = require('./lead-database');
const sessionManager = require('./session-manager');
const outreachDispatcher = require('./outreach-dispatcher');

const assistantMode = require('./assistant-mode');
const mapVisionScout = require('./map-vision-scout');

class AdminCommands {
  async handleCommand(sock, senderJid, text) {
    const parts = text.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    // 1. Check Assistant Mode conversational interceptor
    const isAssistedHandling = await assistantMode.handleAssistedConversation(sock, senderJid, text);
    if (isAssistedHandling && (cmd === '!asistido' || cmd === '!copiloto' || cmd === '!auto' || cmd === '!aprobar-todos' || cmd === '!descartar')) {
      return;
    }

    switch (cmd) {
      case '!scan':
      case '!escanear':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso incorrecto.*\nEjemplo: `!scan panaderias en Chemnitz - Alemania` o `!scan clinicas dentales en Bogota`'
          });
          return;
        }

        await sock.sendMessage(senderJid, {
          text: `⚔️ *Swarm ALARICUS Activado (Web Directa)*\n🔍 Escaneando y curando nicho: *${args}*...\nGenerando prototipos móviles y videos demo.`
        });

        // Trigger batch execution for Web
        swarmOrchestrator.runScanBatch(args, { limit: 5, targetService: 'WEB' }, async (lead) => {
          await sock.sendMessage(senderJid, {
            text: `✨ *Lead Web Verificado:* ${lead.company_name}\n` +
                  `📍 ${lead.location?.city} (${lead.location?.country}) | Tel: ${lead.contact_channel?.phone_e164}\n` +
                  `🌐 Web: ${lead.assets?.landing_page_url}\n` +
                  `🎯 Score: ${lead.diagnostics?.lead_score}/100`
          });
          await outreachDispatcher.dispatchLeadPitch(sock, lead);
        });
        break;

      case '!scan-varego':
      case '!varego':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso incorrecto.*\nEjemplo: `!scan-varego gastrobares en Medellin` o `!scan-varego panaderias en Chemnitz Alemania`'
          });
          return;
        }

        await sock.sendMessage(senderJid, {
          text: `⚡ *Swarm ALARICUS Activado (VAREGO Social & Ads)*\n🔍 Escaneando y auditando: *${args}*...\nEstructurando ofertas de $100 USD/mes con prefijo de país verificado.`
        });

        // Trigger batch execution for VAREGO
        swarmOrchestrator.runScanBatch(args, { limit: 5, targetService: 'VAREGO' }, async (lead) => {
          await sock.sendMessage(senderJid, {
            text: `🔥 *Lead VAREGO Verificado:* ${lead.company_name}\n` +
                  `📸 IG: ${lead.scout_metadata?.social_audit?.instagram_handle || 'N/A'}\n` +
                  `📍 ${lead.location?.city} (${lead.location?.country}) | Tel: ${lead.contact_channel?.phone_e164}\n` +
                  `💼 Propuesta $100/mes: ${lead.assets?.landing_page_url}\n` +
                  `🎯 Score: ${lead.diagnostics?.lead_score}/100`
          });
          await outreachDispatcher.dispatchLeadPitch(sock, lead);
        });
        break;

      case '!mapa':
      case '!map':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso:* `!mapa [ruta_imagen]` o envía una captura de Google Maps adjuntando el texto `!mapa`.\n' +
                  'Ejemplo: `!mapa C:\\capturas\\mapa_chemnitz.jpg`'
          });
          return;
        }

        try {
          await sock.sendMessage(senderJid, { text: `🗺️ *Analizando captura de mapa:* "${args}"...` });
          const mapAnalysis = await mapVisionScout.analyzeMapImage(args);
          let mapMsg = `📍 *Mapa Analizado:* ${mapAnalysis.detected_location.city} (${mapAnalysis.detected_location.country} ${mapAnalysis.detected_location.country_dialing_code})\n` +
                       `🏢 Negocios detectados en el cuadrante:\n`;
          mapAnalysis.extracted_business_pins.forEach((p, idx) => {
            mapMsg += ` ${idx + 1}. *${p.pin_name}* (${p.category}) - ${p.quadrant}\n`;
          });
          mapMsg += `\nIniciando prospección curada sobre estos negocios...`;
          await sock.sendMessage(senderJid, { text: mapMsg });

          for (const query of mapAnalysis.recommended_queries) {
            await swarmOrchestrator.runScanBatch(query, { limit: 2, targetService: 'AUTO' }, async (lead) => {
              await sock.sendMessage(senderJid, {
                text: `✨ *Lead del Mapa Listo:* ${lead.company_name} | Tel: ${lead.contact_channel?.phone_e164}\n🌐 Demo: ${lead.assets?.landing_page_url}`
              });
              await outreachDispatcher.dispatchLeadPitch(sock, lead);
            });
          }
        } catch (mapErr) {
          await sock.sendMessage(senderJid, { text: `❌ Error procesando imagen del mapa: ${mapErr.message}` });
        }
        break;

      case '!estado':
      case '!status':
        const stats = leadDatabase.getStats();
        const sessStats = sessionManager.getGlobalStats();
        const statusMsg = `📊 *ESTADO DEL SWARM ALARICUS (v2.0)*\n\n` +
                          `• Total Leads Registrados: ${stats.totalLeads}\n` +
                          `• Ruta A (Web Directa): ${stats.routeACount}\n` +
                          `• Ruta B (Web Fricción): ${stats.routeBCount}\n` +
                          `• Ruta C (VAREGO Social $100/mo): ${stats.routeCCount || 0}\n` +
                          `• Leads Alta Prioridad: ${stats.highPriorityCount}\n` +
                          `• Pitches Despachados: ${stats.dispatchedCount}\n` +
                          `• Conversaciones Activas: ${sessStats.activeConversations}\n` +
                          `• Cierres / Escalamientos: ${sessStats.escalatedCount}\n\n` +
                          `Estado Pipeline: ${swarmOrchestrator.isPaused ? '⏸️ PAUSADO' : '▶️ ACTIVO'}`;
        await sock.sendMessage(senderJid, { text: statusMsg });
        break;

      case '!pausar':
      case '!pause':
        swarmOrchestrator.pause();
        await sock.sendMessage(senderJid, { text: '⏸️ *Pipeline de escaneo y envíos pausado.*' });
        break;

      case '!reanudar':
      case '!resume':
        swarmOrchestrator.resume();
        await sock.sendMessage(senderJid, { text: '▶️ *Pipeline de escaneo y envíos reanudado.*' });
        break;

      case '!audit-social':
        if (!args) {
          await sock.sendMessage(senderJid, { text: '⚠️ *Uso:* `!audit-social [nombre o handle]`' });
          return;
        }
        const socialAuditor = require('./social-auditor');
        const auditRes = await socialAuditor.auditBusiness({ name: args, user_ratings_total: 25 });
        await sock.sendMessage(senderJid, {
          text: `📊 *Auditoría Social para ${args}:*\n` +
                `• Instagram: ${auditRes.instagram_handle}\n` +
                `• Último Post: Hace ${auditRes.last_post_days_ago} días\n` +
                `• Estado: ${auditRes.social_dormant ? '🔴 Dormante/Inactivo' : '🟢 Activo'}\n` +
                `• Recomendación: ${auditRes.audit_summary}`
        });
        break;

      case '!lead':
        const leadId = args.trim();
        const lead = leadDatabase.getLeadById(leadId);
        if (!lead) {
          await sock.sendMessage(senderJid, { text: `⚠️ Lead ID "${leadId}" no encontrado.` });
        } else {
          await sock.sendMessage(senderJid, {
            text: `📄 *Detalle Lead ${lead.company_name}:*\n` +
                  `• Servicio: ${lead.lead_route === 'RUTA_C_VAREGO' ? 'VAREGO ($100/mo)' : 'Web Directa'}\n` +
                  `• Estado: ${lead.pipeline_status}\n` +
                  `• Ruta: ${lead.lead_route}\n` +
                  `• Teléfono: ${lead.contact_channel?.phone_e164}\n` +
                  `• Propuesta: ${lead.assets?.landing_page_url}\n` +
                  `• Hook: ${lead.diagnostics?.core_pain_hook}`
          });
        }
        break;

      case '!subscout':
      case '!enjambre':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso:* `!subscout [nicho] en [barrio/zona/país] [--service SERVICIO]`\n\n' +
                  'Ejemplos:\n' +
                  '• `!subscout ferreterias en el barrio La Milagrosa de Medellin`\n' +
                  '• `!subscout panaderias en Chemnitz Alemania --service VAREGO_SOCIAL_ADS`\n' +
                  '• `!subscout clinicas en Paris Francia --service AI_AUTOMATION`\n\n' +
                  'Servicios disponibles: `DIRECT_WEB`, `VAREGO_SOCIAL_ADS`, `AI_AUTOMATION`, `ERP_POS_SOFTWARE`, `LEGAL_TAX_COMPLIANCE`, `LOGISTICS_LAST_MILE`'
          });
          return;
        }

        let targetServiceOffer = 'DIRECT_WEB';
        let cleanSubscoutQuery = args;
        if (args.includes('--service')) {
          const serviceParts = args.split('--service');
          cleanSubscoutQuery = serviceParts[0].trim();
          targetServiceOffer = serviceParts[1].trim().toUpperCase();
        }

        await sock.sendMessage(senderJid, {
          text: `🧭 *Desplegando Enjambre de Subscouts Especializados*\n` +
                `🔍 Búsqueda: *${cleanSubscoutQuery}*\n` +
                `💼 Oferta: *${targetServiceOffer}*\n\n` +
                `• Mapeando fuentes institucionales fidedignas (RUES, Handelsregister, RCS, etc.)...\n` +
                `• Evaluando vacancia digital y fricción comercial adaptada...`
        });

        try {
          const subscoutCoordinator = require('./subscouts/subscout-coordinator');
          const swarmResult = await subscoutCoordinator.executeSubscoutSwarm(cleanSubscoutQuery, {
            serviceOffer: targetServiceOffer,
            limit: 3
          });

          let subMsg = `📋 *RESULTADOS DEL ENJAMBRE SUBSCOUT (${swarmResult.total_scouted} negocios)*\n` +
                       `📍 Territorio: ${swarmResult.territory.neighborhood} (${swarmResult.territory.city}, ${swarmResult.territory.country} ${swarmResult.territory.dialing_code})\n` +
                       `🎯 Servicio: ${swarmResult.target_service}\n\n`;

          for (const res of swarmResult.results) {
            subMsg += `🏢 *${res.business_name}* (${res.category})\n` +
                      `  🏛️ Registro: ${res.institutional_verification?.official_registry_board} (CIIU/Código: ${res.institutional_verification?.economic_activity?.activity_code})\n` +
                      `  💡 Fricción: ${res.service_diagnostic?.tailored_pain_hook}\n` +
                      `  🎯 Ajuste Oferta: ${res.service_diagnostic?.service_fit_score}/100\n` +
                      `  🔗 *Dossier:* ${res.dossier?.dossier_url}\n\n`;
          }

          await sock.sendMessage(senderJid, { text: subMsg });
        } catch (subErr) {
          await sock.sendMessage(senderJid, { text: `❌ Error en enjambre subscout: ${subErr.message}` });
        }
        break;

      case '!dossier':
      case '!diagnostico':
      case '!swot':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso:* `!dossier [nicho] en [barrio/zona/ciudad]`\nEjemplo: `!dossier ferreterias en el barrio La Milagrosa de Medellin` o `!dossier panaderias en Chemnitz Alemania`'
          });
          return;
        }

        await sock.sendMessage(senderJid, {
          text: `🔍 *Iniciando Investigación Estratégica Multi-Capa (Dossier & SWOT)*\n` +
                `🎯 Analizando: *${args}*...\n` +
                `• Inspección en Cámara de Comercio / Registro Mercantil\n` +
                `• Auditoría Forense Web, SSL & Stack\n` +
                `• Matriz SWOT / DAFO & Descomposición del Modelo de Negocio`
        });

        try {
          const deepScout = require('./deep-scout');
          const investigation = await deepScout.conductDeepInvestigation(args, { limit: 3 });

          let respText = `📋 *INVESTIGACIÓN ESTRATÉGICA COMPLETADA (${investigation.total_businesses_analyzed} negocios)*\n` +
                         `📍 Micro-Zona: ${investigation.micro_zone} (${investigation.city}, ${investigation.country})\n\n`;

          for (const rep of investigation.reports) {
            respText += `🏢 *${rep.business_name}* (${rep.category})\n` +
                        `  🏛️ Registro: ${rep.registry_verification?.legal_data?.legal_status} (${rep.registry_verification?.registry_source})\n` +
                        `  ⚡ Web: ${rep.web_forensics?.has_website ? 'Indexada (' + rep.web_forensics.cms + ')' : 'Vacancia Digital'}\n` +
                        `  🎯 Postura: ${rep.swot_matrix?.strategic_posture}\n` +
                        `  🔗 *Dossier Completo:* ${rep.dossier?.dossier_url}\n\n`;
          }

          respText += `💡 *Nota:* Estos diagnósticos son de inteligencia pura. No se ha despachado ningún mensaje a los prospectos.`;
          await sock.sendMessage(senderJid, { text: respText });
        } catch (dossierErr) {
          await sock.sendMessage(senderJid, { text: `❌ Error generando dossier: ${dossierErr.message}` });
        }
        break;

      case '!ayuda':
      case '!help':
        const helpMsg = `⚔️ *COMANDOS DE ADMINISTRACIÓN ALARICUS*\n\n` +
                        `🤖 *MODOS DE DESPLIEGUE:*\n` +
                        `• \`!asistido\` (o \`!copiloto\`): Inicia diálogo guiado con revisión previa antes de enviar.\n` +
                        `• \`!auto\`: Modo 100% automático para comandos directos.\n\n` +
                        `🧠 *INTELIGENCIA Y DIAGNÓSTICO ESTRATÉGICO (Puro Scout):*\n` +
                        `• \`!subscout [nicho] en [barrio]\`: Enjambre multi-fuente adaptado a cualquier servicio.\n` +
                        `• \`!dossier [nicho] en [barrio/ciudad]\`: Genera dossiers SWOT y Cámara de Comercio sin enviar mensajes.\n` +
                        `• \`!audit-social [handle]\`: Audita Instagram y Meta Ads de una cuenta.\n\n` +
                        `🔍 *PROSPECCIÓN Y DISPARO COMERCIAL:*\n` +
                        `• \`!scan [nicho] en [ciudad]\`: Prospección para Web Directa (verificación de prefijo de país).\n` +
                        `• \`!scan-varego [nicho] en [ciudad]\`: Prospección VAREGO Social ($100 USD/mes).\n` +
                        `• \`!mapa [ruta_imagen]\`: Analiza una captura de Google Maps y prospecta en esa zona.\n\n` +
                        `⚙️ *CONTROL DE OPERACIONES:*\n` +
                        `• \`!estado\`: Consulta métricas y estadísticas del pipeline.\n` +
                        `• \`!pausar\` / \`!reanudar\`: Control de flujo de envíos.\n` +
                        `• \`!lead [id]\`: Consulta la ficha técnica de un prospecto.\n` +
                        `• \`!aprobar-todos\` / \`!descartar\`: Control de pre-aprobación en modo asistido.`;
        await sock.sendMessage(senderJid, { text: helpMsg });
        break;

      default:
        // Try passing to assistant mode if user typed something with "!" during an active flow (e.g. !Medellín)
        const handledInDefault = await assistantMode.handleAssistedConversation(sock, senderJid, text);
        if (!handledInDefault) {
          await sock.sendMessage(senderJid, {
            text: `⚠️ Comando no reconocido: *${cmd}*\nEscribe *!ayuda* para ver la lista de comandos disponibles.`
          });
        }
        break;
    }
  }
}

module.exports = new AdminCommands();
