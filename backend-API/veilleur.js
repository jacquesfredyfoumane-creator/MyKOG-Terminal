const https = require('https');

class Veilleur {
  constructor(intervalMinutes = 14) {
    this.intervalMinutes = intervalMinutes;
    this.intervalMs = intervalMinutes * 60 * 1000;
    this.intervalId = null;
    this.url = process.env.RENDER_URL || `http://localhost:${process.env.PORT || 3000}`;
  }

  start() {
    console.log(`🔔 Veilleur démarré - Ping toutes les ${this.intervalMinutes} minutes`);
    console.log(`📍 URL surveillée: ${this.url}`);
    
    // Premier ping immédiat
    this.ping();
    
    // Pings réguliers
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.intervalMs);
  }

  ping() {
    const timestamp = new Date().toISOString();
    console.log(`🔄 [${timestamp}] Ping du serveur pour éviter le sleep...`);
    
    const url = this.url.startsWith('http') ? this.url : `https://${this.url}`;
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : require('http');
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': 'MyKOG-Veilleur/1.0',
        'X-Veilleur-Ping': 'true'
      },
      timeout: 10000
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ Ping réussi - Status: ${res.statusCode} - ${timestamp}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`🚀 Serveur actif et répond correctement`);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ Erreur de ping: ${err.message}`);
      if (err.code === 'ECONNREFUSED') {
        console.log(`⚠️  Serveur peut-être en démarrage...`);
      }
    });

    req.on('timeout', () => {
      console.error(`⏰ Timeout du ping après 10 secondes`);
      req.destroy();
    });

    req.end();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Veilleur arrêté');
    }
  }
}

module.exports = Veilleur;
