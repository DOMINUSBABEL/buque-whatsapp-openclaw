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
  console.log('    🚢 BUQUE B2B SWARM - CLI SANDBOX SIMULATOR       ');
  console.log('======================================================\n');

  await previewServer.start();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptMenu = () => {
    console.log('\n--- MENÚ DEL SIMULADOR ---');
    console.log(' [1] 🔍 Ejecutar escaneo de prueba (ej: "restaurantes en Medellin")');
    console.log(' [2] 📊 Ver estadísticas y leads procesados');
    console.log(' [3] 💬 Simular respuesta de un cliente');
    console.log(' [4] ❌ Salir\n');

    rl.question('Selecciona una opción: ', async (ans) => {
      const choice = ans.trim();

      if (choice === '1') {
        rl.question('\nIngresa nicho y ciudad a escanear [ej: odontologia en Medellin]: ', async (q) => {
          const query = q.trim() || 'odontologia en Medellin';
          console.log(`\n⏳ Ejecutando Swarm para: "${query}"...\n`);
          
          const approved = await swarmOrchestrator.runScanBatch(query, { limit: 5 }, (lead) => {
            console.log(`\n✅ [APPROVED LEAD] ${lead.company_name} (${lead.lead_route})`);
            console.log(`   Score: ${lead.diagnostics?.lead_score} | Tel: ${lead.contact_channel?.phone_e164}`);
            console.log(`   Landing: ${lead.assets?.landing_page_url}`);
            if (lead.assets?.video_asset_url) {
              console.log(`   Video Demo: ${lead.assets?.video_asset_url}`);
            }
          });

          console.log(`\n🎉 Lote completado: ${approved.length} leads calificados y listos en base de datos.`);
          promptMenu();
        });
      } else if (choice === '2') {
        const stats = leadDatabase.getStats();
        console.log('\n📊 ESTADÍSTICAS ACTUALES:');
        console.log(JSON.stringify(stats, null, 2));
        promptMenu();
      } else if (choice === '3') {
        rl.question('\nSimula el mensaje del cliente (ej: "¿Cuánto cuesta?"): ', async (userMsg) => {
          const fakeJid = '573114567890@s.whatsapp.net';
          const mockSock = {
            sendMessage: async (jid, content) => {
              console.log(`\n🤖 [BUQUE BOT TO ${jid}]:\n${content.text || content.caption || JSON.stringify(content)}\n`);
            }
          };

          await stateMachine.handleMessage(mockSock, fakeJid, userMsg);
          promptMenu();
        });
      } else if (choice === '4') {
        console.log('👋 Cerrando simulador...');
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
