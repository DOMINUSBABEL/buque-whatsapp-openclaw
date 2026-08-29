/**
 * ALARICUS CLI HELP MANUAL
 * Prints the complete operational command and architecture reference.
 */
console.log(`
================================================================================
                    ⚔️  ALARICUS B2B AGENTIC SWARM (v2.0.0)
               Autonomous Acquisition, Web Directa & VAREGO Engine
================================================================================

🚀 INICIAR SUBSISTEMAS EN POWERSHELL:
  • npm run gateway        -> Inicia el Gateway y Protocolo Baileys WebSocket
  • npm run onboard        -> Asistente de vinculación (Pairing Code / QR)
  • npm run simulator      -> Sandbox interactivo de escaneo (sin WhatsApp)
  • npm run help           -> Muestra esta guía completa de comandos
  • npm test               -> Ejecuta la suite de pruebas automatizadas (10/10)

📱 COMANDOS DE ADMINISTRACIÓN POR WHATSAPP (Desde el número administrador):
  • !scan [nicho] en [ciudad]
      Ejemplo: !scan restaurantes en Medellin
      Ejemplo: !scan clinicas dentales en Bogota
      -> Activa el enjambre para RUTA A (Sin Web) y RUTA B (Fricción Web).

  • !scan-varego [nicho] en [ciudad]
      Ejemplo: !scan-varego gastrobares en Medellin
      Ejemplo: !scan-varego esteticas en Cali
      -> Activa prospección para VAREGO Social & Meta Ads ($100 USD/mes).

  • !audit-social [nombre o handle]
      Ejemplo: !audit-social gastrobar.terraza
      -> Realiza una auditoría instantánea de presencia y dormancia en Instagram.

  • !estado  o  !status
      -> Consulta métricas en tiempo real de leads, desglose y MRR potencial.

  • !lead [id_del_lead]
      -> Muestra la ficha técnica completa y enlace de propuesta del prospecto.

  • !pausar  /  !reanudar
      -> Pausa o reactiva temporalmente el despacho de mensajes en WhatsApp.

  • !ayuda  o  !help
      -> Imprime el manual de comandos directamente en WhatsApp.

🌐 DASHBOARD WEB & PREVIEW SERVER:
  • URL: http://localhost:3000/dashboard
  • Previsualizaciones de Web/Propuestas: http://localhost:3000/demo/[slug]
================================================================================
`);
