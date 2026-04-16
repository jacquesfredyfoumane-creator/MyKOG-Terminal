// Charger les variables d'environnement
require('dotenv').config();

const { RoomServiceClient, EgressClient } = require('livekit-server-sdk');

class LiveKitService {
  constructor() {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.LIVEKIT_URL || !process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      throw new Error('Variables LiveKit manquantes: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET');
    }

    console.log('Initialisation LiveKit avec URL:', process.env.LIVEKIT_URL);
    
    // Initialiser le client LiveKit avec vos paramètres
    this.client = new RoomServiceClient(
      process.env.LIVEKIT_URL,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );
    
    this.egressClient = new EgressClient(
      process.env.LIVEKIT_URL,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );
  }

  /**
   * Créer une nouvelle room pour le streaming
   */
  async createRoom(roomName, options = {}) {
    try {
      const room = await this.client.createRoom({
        name: roomName,
        emptyTimeout: 300, // 5 minutes avant suppression si vide
        maxParticipants: 1000,
        ...options
      });
      
      console.log(`Room créée: ${room.name}`);
      return room;
    } catch (error) {
      console.error('Erreur création room:', error);
      throw error;
    }
  }

  /**
   * Générer un token pour un participant
   */
  async generateParticipantToken(roomName, participantName, isHost = false) {
    try {
      const { AccessToken } = require('livekit-server-sdk');
      
      const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
          identity: participantName,
          name: participantName,
          ttl: '24h', // Token valide 24h
        }
      );

      // Permissions selon le rôle
      if (isHost) {
        at.addGrant({
          roomJoin: true,
          room: roomName,
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
          canManage: true,
        });
      } else {
        at.addGrant({
          roomJoin: true,
          room: roomName,
          canPublish: false, // Les viewers ne peuvent pas publier
          canSubscribe: true,
          canPublishData: true, // Peuvent envoyer des messages
        });
      }

      const token = at.toJwt();
      console.log(`Token généré pour ${participantName} (${isHost ? 'host' : 'viewer'})`);
      return token;
    } catch (error) {
      console.error('Erreur génération token:', error);
      throw error;
    }
  }

  /**
   * Lister toutes les rooms actives
   */
  async listRooms() {
    try {
      const rooms = await this.client.listRooms();
      return rooms;
    } catch (error) {
      console.error('Erreur listage rooms:', error);
      throw error;
    }
  }

  /**
   * Supprimer une room
   */
  async deleteRoom(roomName) {
    try {
      await this.client.deleteRoom(roomName);
      console.log(`Room supprimée: ${roomName}`);
    } catch (error) {
      console.error('Erreur suppression room:', error);
      throw error;
    }
  }

  /**
   * Démarrer un enregistrement (egress)
   */
  async startRecording(roomName, outputUrl = null) {
    try {
      const egress = await this.egressClient.startRoomCompositeEgress({
        roomName: roomName,
        layout: 'grid', // ou 'speaker' pour vue principale
        output: {
          urls: outputUrl ? [outputUrl] : undefined,
          fileType: 'mp4',
        }
      });
      
      console.log(`Enregistrement démarré pour room: ${roomName}`);
      return egress;
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
      throw error;
    }
  }

  /**
   * Arrêter un enregistrement
   */
  async stopRecording(egressId) {
    try {
      await this.egressClient.stopEgress(egressId);
      console.log(`Enregistrement arrêté: ${egressId}`);
    } catch (error) {
      console.error('Erreur arrêt enregistrement:', error);
      throw error;
    }
  }

  /**
   * Obtenir les participants d'une room
   */
  async getParticipants(roomName) {
    try {
      const participants = await this.client.listParticipants(roomName);
      return participants;
    } catch (error) {
      console.error('Erreur récupération participants:', error);
      throw error;
    }
  }

  /**
   * Éjecter un participant
   */
  async removeParticipant(roomName, participantIdentity) {
    try {
      await this.client.removeParticipant(roomName, participantIdentity);
      console.log(`Participant éjecté: ${participantIdentity}`);
    } catch (error) {
      console.error('Erreur éjection participant:', error);
      throw error;
    }
  }
}

module.exports = LiveKitService;
