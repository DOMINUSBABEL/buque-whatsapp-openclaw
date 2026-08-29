/**
 * SIMULATOR CLI
 * Interactive terminal sandbox for executing the complete Buque Swarm
 * and testing prospect conversations without connecting a physical WhatsApp socket.
 */
const readline = require('readline');
const swarmOrchestrator = require('./swarm-orchestrator');
const previewServer = require('./preview-server');
const leadDatabase = require('./lead-database');
const stateMachine = require('./state-machine');

async function runSimulator() {
  console.clear();
  console.log('======================================================');
  console.log('   ⚔️  ALARICUS B2B SWARM - CLI SANDBOX SIMULATOR      ');
  console.log('======================================================\n');

  await previewServer.start();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptMenu = () => {
    console.log('\n--- MENÚ DEL SIMULADOR ALARICUS ---');
    console.log(' [1] 🌐 Escaneo Web Directa (Rutas A/B - ej: "restaurantes en Medellin")');
    console.log(' [2] 📱 Escaneo VAREGO Social & Ads (Ruta C - $100 USD/mo CM)');
    console.log(' [3] 📊 Ver estadísticas y leads procesados');
    console.log(' [4] 💬 Simular respuesta de un prospecto');
    console.log(' [5] ❌ Salir\n');

    rl.question('Selecciona una opción: ', async (ans) => {
      const choice = ans.trim();

      if (choice === '1') {
        rl.question('\nIngresa nicho y ciudad para Web Directa [ej: odontologia en Medellin]: ', async (q) => {
          const query = q.trim() || 'odontologia en Medellin';
          console.log(`\n⏳ Ejecutando ALARICUS Web Scan para: "${query}"...\n`);
          
          const approved = await swarmOrchestrator.runScanBatch(query, { limit: 5, targetService: 'WEB' }, (lead) => {
            console.log(`\n✅ [APPROVED LEAD] ${lead.company_name} (${lead.lead_route})`);
            console.log(`   Score: ${lead.diagnostics?.lead_score} | Tel: ${lead.contact_channel?.phone_e164}`);
            console.log(`   Landing: ${lead.assets?.landing_page_url}`);
            if (lead.assets?.video_asset_url) {
              console.log(`   Video Demo: ${lead.assets?.video_asset_url}`);
            }
          });

          console.log(`\n🎉 Lote completado: ${approved.length} leads calificados y listos.`);
          promptMenu();
        });
      } else if (choice === '2') {
        rl.question('\nIngresa nicho y ciudad para VAREGO Social & Ads [ej: gastrobares en Medellin]: ', async (q) => {
          const query = q.trim() || 'gastrobares en Medellin';
          console.log(`\n⏳ Ejecutando ALARICUS VAREGO Social Swarm para: "${query}"...\n`);

          const approved = await swarmOrchestrator.runScanBatch(query, { limit: 5, targetService: 'VAREGO' }, (lead) => {
            console.log(`\n🔥 [VAREGO QUALIFIED] ${lead.company_name} (RUTA_C_VAREGO)`);
            console.log(`   Instagram: ${lead.scout_metadata?.social_audit?.instagram_handle || 'Pendiente'}`);
            console.log(`   Último Post: Hace ${lead.scout_metadata?.social_audit?.last_post_days_ago || '30+'} días`);
            console.log(`   Fee Propuesto: $100 USD/mes + Pauta cliente`);
            console.log(`   Landing VAREGO: ${lead.assets?.landing_page_url}`);
          });

          console.log(`\n🎉 Lote VAREGO completado: ${approved.length} prospectos listos para prospección.`);
          promptMenu();
        });
      } else if (choice === '3') {
        const stats = leadDatabase.getStats();
        console.log('\n📊 ESTADÍSTICAS ACTUALES DE ALARICUS:');
        console.log(JSON.stringify(stats, null, 2));
        promptMenu();
      } else if (choice === '4') {
        rl.question('\nSimula el mensaje del cliente (ej: "¿Qué incluye el plan de 100 dólares?"): ', async (userMsg) => {
          const fakeJid = '573114567890@s.whatsapp.net';
          const mockSock = {
            sendMessage: async (jid, content) => {
              console.log(`\n🤖 [ALARICUS BOT TO ${jid}]:\n${content.text || content.caption || JSON.stringify(content)}\n`);
            }
          };

          await stateMachine.handleMessage(mockSock, fakeJid, userMsg);
          promptMenu();
        });
      } else if (choice === '5') {
        console.log('👋 Cerrando simulador ALARICUS...');
        previewServer.stop();
        rl.close();
        process.exit(0);
      } else {
        promptMenu();
      }
    });
  };

  promptMenu();
}

if (require.main === module) {
  runSimulator();
}

module.exports = { runSimulator };
