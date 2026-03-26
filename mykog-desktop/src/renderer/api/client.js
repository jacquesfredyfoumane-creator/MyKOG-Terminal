import axios from 'axios';
import { API_CONFIG } from '../utils/config.js';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.getBaseURL();
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Intercepteurs pour gestion d'erreurs
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error);
        if (error.code === 'ECONNREFUSED') {
          console.error('❌ Impossible de se connecter au backend. Vérifiez que le serveur est démarré sur', this.baseURL);
        }
        return Promise.reject(error);
      }
    );
  }

  // Enseignements
  async getEnseignements() {
    try {
      const response = await this.client.get('/api/enseignements');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des enseignements:', error);
      return [];
    }
  }

  async getEnseignement(id) {
    try {
      const response = await this.client.get(`/api/enseignements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'enseignement ${id}:`, error);
      return null;
    }
  }

  // Streaming
  getStreamURL(streamId) {
    return `${this.baseURL}/hls/${streamId}/index.m3u8`;
  }

  getRTMPURL() {
    return `rtmp://${this.baseURL.replace('http://', '').replace(':3000', '')}:1935/live`;
  }

  // Utilisateurs
  async registerUser(name, phone) {
    try {
      const response = await this.client.post('/api/users/register', {
        name,
        phone
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const response = await this.client.get('/api/users/profile');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

  // Live Streaming
  async getLiveStreams() {
    try {
      const response = await this.client.get('/api/live/streams');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des streams:', error);
      return [];
    }
  }

  async startLiveStream(title) {
    try {
      const response = await this.client.post('/api/live/start', { title });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage du stream:', error);
      throw error;
    }
  }

  async stopLiveStream() {
    try {
      const response = await this.client.post('/api/live/stop');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du stream:', error);
      throw error;
    }
  }
}

export default new ApiClient();
