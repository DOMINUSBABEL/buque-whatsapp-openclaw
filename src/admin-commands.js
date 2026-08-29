/**
 * ADMIN COMMANDS
 * Intercepts and executes administrative commands issued by authorized operator numbers.
 */
const swarmOrchestrator = require('./swarm-orchestrator');
const leadDatabase = require('./lead-database');
const sessionManager = require('./session-manager');
const outreachDispatcher = require('./outreach-dispatcher');

class AdminCommands {
  async handleCommand(sock, senderJid, text) {
    const parts = text.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case '!scan':
      case '!escanear':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso incorrecto.*\nEjemplo: `!scan restaurantes en Medellin` o `!scan clinicas dentales en Bogota`'
          });
          return;
        }

        await sock.sendMessage(senderJid, {
          text: `⚔️ *Swarm ALARICUS Activado (Web Directa)*\n🔍 Escaneando nicho: *${args}*...\nGenerando prototipos móviles y videos demo.`
        });

        // Trigger batch execution for Web
        swarmOrchestrator.runScanBatch(args, { limit: 10, targetService: 'WEB' }, async (lead) => {
          await sock.sendMessage(senderJid, {
            text: `✨ *Lead Web Listo:* ${lead.company_name}\n` +
                  `📍 ${lead.location?.city} | Score: ${lead.diagnostics?.lead_score}/100\n` +
                  `🌐 Web: ${lead.assets?.landing_page_url}\n` +
                  `📱 Tel: ${lead.contact_channel?.phone_e164}`
          });
          await outreachDispatcher.dispatchLeadPitch(sock, lead);
        });
        break;

      case '!scan-varego':
      case '!varego':
        if (!args) {
          await sock.sendMessage(senderJid, {
            text: '⚠️ *Uso incorrecto.*\nEjemplo: `!scan-varego gastrobares en Medellin` o `!scan-varego esteticas en Cali`'
          });
          return;
        }

        await sock.sendMessage(senderJid, {
          text: `⚡ *Swarm ALARICUS Activado (VAREGO Social & Ads)*\n🔍 Escaneando nicho: *${args}*...\nAuditando Instagram/Meta Ads y estructurando ofertas de $100 USD/mes.`
        });

        // Trigger batch execution for VAREGO
        swarmOrchestrator.runScanBatch(args, { limit: 10, targetService: 'VAREGO' }, async (lead) => {
          await sock.sendMessage(senderJid, {
            text: `🔥 *Lead VAREGO Listo:* ${lead.company_name}\n` +
                  `📸 IG: ${lead.scout_metadata?.social_audit?.instagram_handle || 'N/A'}\n` +
                  `📍 ${lead.location?.city} | Score: ${lead.diagnostics?.lead_score}/100\n` +
                  `💼 Propuesta $100/mes: ${lead.assets?.landing_page_url}\n` +
                  `📱 Tel: ${lead.contact_channel?.phone_e164}`
          });
          await outreachDispatcher.dispatchLeadPitch(sock, lead);
        });
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

      case '!ayuda':
      case '!help':
      default:
        const helpMsg = `⚔️ *COMANDOS DE ADMINISTRACIÓN ALARICUS*\n\n` +
                        `• \`!scan [nicho] en [ciudad]\`: Escaneo para Web Directa y catálogo.\n` +
                        `• \`!scan-varego [nicho] en [ciudad]\`: Escaneo para VAREGO Social & Meta Ads ($100 USD/mes).\n` +
                        `• \`!estado\`: Consulta métricas y estadísticas del pipeline.\n` +
                        `• \`!pausar\`: Pausa temporalmente nuevos envíos.\n` +
                        `• \`!reanudar\`: Reanuda el flujo de trabajo.\n` +
                        `• \`!lead [id]\`: Consulta la ficha técnica de un prospecto.\n` +
                        `• \`!ayuda\`: Muestra esta lista de comandos.`;
        await sock.sendMessage(senderJid, { text: helpMsg });
        break;
    }
  }
}

module.exports = new AdminCommands();
