/**
 * Veilleur pour le Dashboard Admin sur Render
 * Maintient le service actif en envoyant des requêtes ping régulières
 */

const https = require('https');
const http = require('http');

// Configuration
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://mykog-admin-dashboard.onrender.com';
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL) || 840000; // 14 minutes par défaut

class Veilleur {
  constructor(intervalMinutes = 14) {
    this.interval = intervalMinutes * 60 * 1000; // Convertir en millisecondes
    this.url = DASHBOARD_URL;
    this.intervalId = null;
  }

  async ping() {
    try {
      console.log(`🔔 Veilleur: Ping vers ${this.url}`);
      
      const startTime = Date.now();
      
      // Choisir le bon protocole
      const client = this.url.startsWith('https') ? https : http;
      
      const response = await new Promise((resolve, reject) => {
        const req = client.get(this.url, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              responseTime: Date.now() - startTime,
              headers: res.headers
            });
          });
        });
        
        req.on('error', reject);
        req.setTimeout(30000, () => {
          req.destroy();
          reject(new Error('Timeout après 30 secondes'));
        });
      });

      console.log(`✅ Ping réussi - Status: ${response.statusCode} - Temps: ${response.responseTime}ms`);
      
      // Log détaillé pour monitoring
      if (response.statusCode === 200) {
        console.log(`🟢 Dashboard actif et accessible`);
      } else if (response.statusCode >= 400 && response.statusCode < 500) {
        console.log(`🟡 Dashboard répond mais avec erreur client: ${response.statusCode}`);
      } else {
        console.log(`🔴 Dashboard répond avec erreur serveur: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.error(`❌ Erreur de ping vers ${this.url}:`, error.message);
      
      // Ne pas arrêter le veilleur en cas d'erreur, continuer à essayer
      if (error.message.includes('timeout')) {
        console.log(`⏰ Timeout de connexion - Le dashboard est peut-être en démarrage`);
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log(`🔌 Connexion refusée - Le dashboard n'est pas encore démarré`);
      } else {
        console.log(`🌐 Erreur réseau - Vérification de la connexion`);
      }
    }
  }

  start() {
    console.log(`🚀 Démarrage du veilleur pour: ${this.url}`);
    console.log(`⏰ Intervalle de ping: ${this.interval / 60000} minutes`);
    
    // Premier ping immédiat
    this.ping();
    
    // Configurer les pings réguliers
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.interval);
    
    console.log(`✅ Veilleur démarré - Prochain ping dans ${this.interval / 60000} minutes`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log(`🛑 Veilleur arrêté`);
    }
  }
}

// Gestion du cycle de vie
const veilleur = new Veilleur(Math.floor(PING_INTERVAL / 60000));

veilleur.start();

// Nettoyage propre à l'arrêt
process.on('SIGINT', () => {
  console.log('\n📡 Signal SIGINT reçu - Arrêt du veilleur...');
  veilleur.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n📡 Signal SIGTERM reçu - Arrêt du veilleur...');
  veilleur.stop();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Erreur non capturée:', error);
  // Ne pas arrêter le veilleur, continuer à fonctionner
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Rejet non géré:', reason);
  // Ne pas arrêter le veilleur, continuer à fonctionner
});

console.log(`🌙 Veilleur Dashboard Admin - Actif et surveillant ${DASHBOARD_URL}`);
