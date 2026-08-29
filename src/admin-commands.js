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
          text: `🚀 *Swarm Buque Activado*\n🔍 Escaneando nicho: *${args}*...\nGenerando prototipos y videos a medida.`
        });

        // Trigger batch execution in background
        swarmOrchestrator.runScanBatch(args, { limit: 10 }, async (lead) => {
          // Progress callback for each approved lead
          await sock.sendMessage(senderJid, {
            text: `✨ *Lead Listo:* ${lead.company_name}\n` +
                  `📍 ${lead.location?.city} | Score: ${lead.diagnostics?.lead_score}/100\n` +
                  `🌐 Web: ${lead.assets?.landing_page_url}\n` +
                  `📱 Tel: ${lead.contact_channel?.phone_e164}`
          });

          // Dispatch initial pitch
          await outreachDispatcher.dispatchLeadPitch(sock, lead);
        });
        break;

      case '!estado':
      case '!status':
        const stats = leadDatabase.getStats();
        const sessStats = sessionManager.getGlobalStats();
        const statusMsg = `📊 *ESTADO DEL SWARM BUQUE*\n\n` +
                          `• Total Leads Registrados: ${stats.totalLeads}\n` +
                          `• Ruta A (Sin Web): ${stats.routeACount}\n` +
                          `• Ruta B (Fricción): ${stats.routeBCount}\n` +
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
                  `• Estado: ${lead.pipeline_status}\n` +
                  `• Ruta: ${lead.lead_route}\n` +
                  `• Teléfono: ${lead.contact_channel?.phone_e164}\n` +
                  `• Web Prototipo: ${lead.assets?.landing_page_url}\n` +
                  `• Hook: ${lead.diagnostics?.core_pain_hook}`
          });
        }
        break;

      case '!ayuda':
      case '!help':
      default:
        const helpMsg = `🤖 *COMANDOS DE ADMINISTRACIÓN BUQUE*\n\n` +
                        `• \`!scan [nicho] en [ciudad]\`: Inicia escaneo y prospección.\n` +
                        `• \`!estado\`: Consulta métricas y estadísticas del día.\n` +
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
