/**
 * ONBOARDING WIZARD
 * Guides the user through WhatsApp pairing mode selection (Pairing Code vs QR in terminal).
 */
const readline = require('readline');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk') || { cyan: String, green: String, yellow: String, red: String, bold: String };

class OnboardingWizard {
  static async askPairingChoice() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      console.log('\n======================================================');
      console.log('       🚢 BUQUE B2B AGENTIC HARNESS (OPENCLAW)       ');
      console.log('======================================================\n');
      console.log('Selecciona el método de vinculación de WhatsApp:');
      console.log(' [1] 🔑 Código de Emparejamiento (8 dígitos en tu teléfono)');
      console.log(' [2] 📱 Código QR en la terminal\n');

      rl.question('Elige una opción (1 o 2) [Default 1]: ', (ans) => {
        const choice = ans.trim();
        if (choice === '2') {
          rl.close();
          resolve({ method: 'QR', phoneNumber: null });
        } else {
          rl.question('\nIngresa el número de teléfono con código de país (ej: +573001234567): ', (phone) => {
            rl.close();
            const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
            if (!cleanPhone) {
              console.log('⚠️ Número no válido. Utilizando código QR por defecto.');
              resolve({ method: 'QR', phoneNumber: null });
            } else {
              resolve({ method: 'PAIRING_CODE', phoneNumber: `+${cleanPhone}` });
            }
          });
        }
      });
    });
  }

  static renderQr(qrString) {
    console.log('\n📱 Escanea este código QR con tu WhatsApp:\n');
    qrcode.generate(qrString, { small: true });
    console.log('\nAbre WhatsApp > Dispositivos vinculados > Vincular un dispositivo.\n');
  }

  static renderPairingCode(code) {
    console.log('\n======================================================');
    console.log(`  🔑 TU CÓDIGO DE VINCULACIÓN:  ${code}  `);
    console.log('======================================================');
    console.log('1. Abre WhatsApp en tu celular.');
    console.log('2. Ve a Dispositivos vinculados > Vincular dispositivo.');
    console.log('3. Toca "Vincular con el número de teléfono" e ingresa este código.\n');
  }
}

module.exports = OnboardingWizard;
