// Configuration de l'API
export const API_CONFIG = {
  // Détection automatique de l'IP
  // En développement, utiliser localhost
  // En production, détecter l'IP du réseau
  getBaseURL() {
    // Vérifier si on est en mode développement
    if (process.env.NODE_ENV === 'development' || window.location.protocol === 'file:') {
      return 'http://localhost:3000';
    }
    
    // TODO: Implémenter détection IP réseau automatique
    // Pour l'instant, utiliser l'IP par défaut
    return 'http://192.168.1.195:3000';
  },
  
  // Port du serveur
  port: 3000,
  
  // Timeout pour les requêtes
  timeout: 10000
};
