const os = require('os');

/**
 * Configuration des streams RTMP/HLS
 */
const STREAM_CONFIG = {
  // Clé de stream par défaut
  DEFAULT_STREAM_KEY: 'mykog_live',
  
  // Port RTMP
  RTMP_PORT: 1935,
  
  // Port HTTP pour HLS
  HLS_PORT: 8080,
  
  // Chemin HLS
  HLS_PATH: '/hls',
};

/**
 * Obtenir l'IP du serveur
 */
function getServerIP() {
  const interfaces = os.networkInterfaces();
  
  // Interfaces virtuelles à ignorer
  const virtualInterfaces = ['virbr0', 'docker0', 'br-', 'veth', 'lo'];
  
  // Chercher l'IP sur l'interface WiFi ou Ethernet réelle
  for (const name of Object.keys(interfaces)) {
    // Ignorer les interfaces virtuelles
    if (virtualInterfaces.some(vif => name.includes(vif))) {
      continue;
    }
    
    for (const iface of interfaces[name]) {
      // Ignorer les adresses internes et IPv6
      if (iface.family === 'IPv4' && !iface.internal) {
        // Préférer les IPs qui commencent par 192.168 (sauf 192.168.122.x qui est virbr0)
        if (iface.address.startsWith('192.168.') && 
            !iface.address.startsWith('192.168.122.')) {
          return iface.address;
        }
      }
    }
  }
  
  // Fallback : première IP non interne et non virtuelle
  for (const name of Object.keys(interfaces)) {
    if (virtualInterfaces.some(vif => name.includes(vif))) {
      continue;
    }
    
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Éviter les IPs Docker et virbr0
        if (!iface.address.startsWith('172.17.') && 
            !iface.address.startsWith('172.18.') &&
            !iface.address.startsWith('192.168.122.')) {
          return iface.address;
        }
      }
    }
  }
  
  return 'localhost';
}

/**
 * Générer l'URL RTMP pour OBS
 * @param {string} streamKey - Clé de stream (optionnel, utilise la clé par défaut si non fournie)
 * @returns {string} URL RTMP complète
 */
function getRTMPUrl(streamKey = STREAM_CONFIG.DEFAULT_STREAM_KEY) {
  const ip = getServerIP();
  return `rtmp://${ip}:${STREAM_CONFIG.RTMP_PORT}/live/${streamKey}`;
}

/**
 * Générer l'URL HLS pour la lecture dans l'app
 * @param {string} streamKey - Clé de stream (optionnel, utilise la clé par défaut si non fournie)
 * @returns {string} URL HLS complète
 */
function getHLSUrl(streamKey = STREAM_CONFIG.DEFAULT_STREAM_KEY) {
  const ip = getServerIP();
  return `http://${ip}:${STREAM_CONFIG.HLS_PORT}${STREAM_CONFIG.HLS_PATH}/${streamKey}/index.m3u8`;
}

/**
 * Générer l'URL HLS avec IP personnalisée
 * @param {string} ip - IP du serveur
 * @param {string} streamKey - Clé de stream
 * @returns {string} URL HLS complète
 */
function getHLSUrlWithIP(ip, streamKey = STREAM_CONFIG.DEFAULT_STREAM_KEY) {
  return `http://${ip}:${STREAM_CONFIG.HLS_PORT}${STREAM_CONFIG.HLS_PATH}/${streamKey}/index.m3u8`;
}

/**
 * Générer l'URL RTMP avec IP personnalisée
 * @param {string} ip - IP du serveur
 * @param {string} streamKey - Clé de stream
 * @returns {string} URL RTMP complète
 */
function getRTMPUrlWithIP(ip, streamKey = STREAM_CONFIG.DEFAULT_STREAM_KEY) {
  return `rtmp://${ip}:${STREAM_CONFIG.RTMP_PORT}/live/${streamKey}`;
}

/**
 * Valider une clé de stream
 * @param {string} streamKey - Clé à valider
 * @returns {boolean} True si valide
 */
function isValidStreamKey(streamKey) {
  if (!streamKey || typeof streamKey !== 'string') {
    return false;
  }
  
  // La clé doit contenir uniquement des caractères alphanumériques, tirets et underscores
  return /^[a-zA-Z0-9_-]+$/.test(streamKey);
}

/**
 * Générer une clé de stream aléatoire
 * @returns {string} Clé de stream générée
 */
function generateStreamKey() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `mykog_${timestamp}_${random}`;
}

module.exports = {
  STREAM_CONFIG,
  getServerIP,
  getRTMPUrl,
  getHLSUrl,
  getHLSUrlWithIP,
  getRTMPUrlWithIP,
  isValidStreamKey,
  generateStreamKey,
};

