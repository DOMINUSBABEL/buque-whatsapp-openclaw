# ⚔️ ALARICUS B2B: Autonomous Multi-Agent Acquisition Swarm & VAREGO Social Engine

### *A Deterministic State-Graph Harness for Commercial Discovery, Mobile Web Compilation, VAREGO Social Media Auditing ( USD/mo), Synthetic Micro-Video Production, and Closed-Loop WhatsApp Outreach*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-blue.svg)](https://nodejs.org/)
[![Protocol: Baileys](https://img.shields.io/badge/Protocol-WhiskeySockets%20Baileys-green.svg)](https://github.com/WhiskeySockets/Baileys)
[![Architecture: OpenClaw Swarm](https://img.shields.io/badge/Architecture-OpenClaw%20Swarm-purple.svg)](https://github.com/DOMINUSBABEL)
[![Version: 2.0.0](https://img.shields.io/badge/Release-v2.0.0--ALARICUS-rose.svg)](https://github.com/DOMINUSBABEL)

---

`
                       ALARICUS B2B AGENTIC SWARM ARCHITECTURE
 
    [ Operator / Admin WhatsApp ] ──── Trigger: "!scan restaurantes" or "!scan-varego gastrobares"
                  │
                  ▼
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃           PROTOCOL GATEWAY & RUNTIME CONTROLLER (Node.js)           ┃
    ┃  • Baileys WebSocket with Cacheable Signal KeyStore                 ┃
    ┃  • Signal Auto-Healer (Zero-Lockout on MessageCounterError/Bad MAC) ┃
    ┃  • Dual Pipeline: Web Directa (Rutas A/B) + VAREGO Social (Ruta C)  ┃
    ┃  • Anti-Overlap Per-User Queue & Pacing Delay Simulator (45-120s)   ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                          │
                                          ▼
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃              6-AGENT AUTONOMOUS B2B PIPELINE (SWARM)                ┃
    ┃  ┌─────────────────────────────┐   ┌─────────────────────────────┐  ┃
    ┃  │  1. SCOUT_AGENT             │   │  4. FILMER_AGENT            │  ┃
    ┃  │     (Maps & Social Auditor) │   │     (10s 9:16 Vertical Demo)│  ┃
    ┃  ├─────────────────────────────┤   ├─────────────────────────────┤  ┃
    ┃  │  2. DIAGNOSER_AGENT         │   │  5. CHECKER_AGENT (QA)      │  ┃
    ┃  │     (Heuristics & Copy Gen) │   │     (E.164, Latency & Rate) │  ┃
    ┃  ├─────────────────────────────┤   ├─────────────────────────────┤  ┃
    ┃  │  3. BUILDER_AGENT           │   │  6. PITCHER_AGENT           │  ┃
    ┃  │     (Web & VAREGO Proposals)│   │     (WhatsApp State-Machine)│  ┃
    ┃  └─────────────────────────────┘   └─────────────────────────────┘  ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                          │
                                          ▼
    [ Prospect Client (WhatsApp) ] ──── Video Demo + Live Proposal / Web Preview
                  │
                  ▼
    [ Bidirectional Negotiation ] ──── Auto-Closing / Human Escalation Loop
`

---

## 📄 Abstract (Resumen Ejecutivo)

**Español:**  
**ALARICUS** es un *Harness Agéntico Multimodal Autónomo* de prospección B2B que opera bajo el protocolo OpenClaw y Baileys WebSocket. Integra dos líneas de negocio comerciales no excluyentes:

1. **🌐 Servicio Web Directa (Rutas A y B):**
   - **Ruta A:** Negocios sin página web directa para captar clientes ($\ge 3$ reseñas). Genera catálogo interactivo y pedidos a WhatsApp sin comisiones.
   - **Ruta B:** Negocios con sitio web deficiente o enlaces caídos ($\le 3.9$ o keywords de fricción). Ofrece rediseño de carga ultrarrápida.
2. **📱 Servicio VAREGO Social & Meta Ads (Ruta C):**
   - Negocios que requieren acelerar su captación de clientes y generar liquidez mediante redes sociales activas y campañas de Meta Ads.
   - **Oferta comercial:** ** USD / mes** de costo base de Community Management (diseño de 12 piezas/reels mensuales + estrategia y optimización de anuncios). El presupuesto publicitario en pauta es cubierto y administrado directamente por el cliente con total flexibilidad.

---

## 🔬 Agent Topology & Operational Specification

| Agent Role | Subsystem | Responsibility & Throughput |
| :--- | :--- | :--- |
| **SCOUT_AGENT** | src/scout-engine.js & src/social-auditor.js | Descubrimiento georreferenciado en Google Maps y auditoría de presencia en Instagram/Meta Ads. |
| **DIAGNOSER_AGENT** | src/diagnoser-engine.js | Scoring multifactorial (1-100), formulación de dolores comerciales y generación de copys en 4 canales. |
| **BUILDER_AGENT** | src/builder-engine.js | Compilación instantánea de páginas web móviles y decks interactivos de propuesta VAREGO. |
| **FILMER_AGENT** | src/filmer-engine.js & src/video-compiler.js | Producción de micro-demos verticales 9:16 (1080x1920 MP4 a 30 FPS con subtítulos cinéticos). |
| **CHECKER_AGENT** | src/checker-qa.js | Quality gatekeeper (E.164, latencia HTTP $< 1.5\,\text{s}$, integridad de precios y ausencia de placeholders). |
| **PITCHER_AGENT** | src/state-machine.js & src/outreach-dispatcher.js | Despacho con jitter anti-spam (45-120s) y negociación conversacional determinista en WhatsApp. |

---

## 🚀 Quick Start & Installation

### 1. Requisitos
- **Node.js**: v18.0.0 o superior
- **FFmpeg**: Instalado en el sistema
- **Git**

### 2. Clonar e Instalar
`ash
git clone https://github.com/DOMINUSBABEL/buque-whatsapp-openclaw.git alaricus-b2b-swarm
cd alaricus-b2b-swarm
npm install
`

### 3. Ejecutar Servidor Autónomo
En Windows:
`ash
start-alaricus.bat
`
En Linux / macOS / Docker:
`ash
./start-alaricus.sh
# o con Docker
docker-compose up -d
`

### 4. Sandbox CLI Simulator (Pruebas sin teléfono físico)
`ash
npm run simulator
`

---

## 💬 Comandos de Administración por WhatsApp

- !scan [nicho] en [ciudad] — Escaneo para Web Directa y catálogo móvil.
  - *Ejemplo:* !scan restaurantes en Medellin
- !scan-varego [nicho] en [ciudad] — Escaneo para VAREGO Social & Meta Ads ( USD/mes).
  - *Ejemplo:* !scan-varego gastrobares en Medellin
  - *Ejemplo:* !scan-varego clinicas esteticas en Bogota
- !estado — Métricas de leads, desglose por Rutas A/B/C y MRR potencial acumulado.
- !pausar — Pausa temporal de envíos.
- !reanudar — Reanuda el pipeline.
- !lead [lead_id] — Consulta la ficha técnica de un prospecto.
- !ayuda — Muestra el manual de comandos.

---

## 📊 Dashboard Web en Tiempo Real

El servidor de previsualización incluye una interfaz gráfica de monitoreo en:
`
http://localhost:3000/dashboard
`

---

## 🛡️ Licencia y Autor

- **Autor:** Dominus Babel / BABYLON.IA (Juan Esteban Gómez Bernal)
- **Licencia:** [MIT License](LICENSE)

## 📜 Registro de Cambios
Consulte el archivo [CHANGELOG.md](CHANGELOG.md) para ver el historial detallado de versiones y mejoras de ALARICUS v2.0.0.
