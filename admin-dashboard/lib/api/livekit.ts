import { apiClient } from './client';

export interface LiveKitRoom {
  name: string;
  sid: string;
  maxParticipants: number;
  numParticipants?: number;
  creationTime?: number;
}

export interface LiveKitToken {
  token: string;
  roomName: string;
  participantName: string;
  isHost: boolean;
  liveKitUrl?: string;
}

export interface LiveKitObsConfig {
  livekit: {
    serverUrl: string;
    apiKey: string;
    roomName: string;
  };
  obs: {
    whip: {
      url: string;
      bearerToken: string;
      instructions: string;
    };
    rtmp: {
      url: string;
      streamKey: string;
      instructions: string;
    };
  };
  flutter: {
    viewerToken: string;
    serverUrl: string;
    roomName: string;
    instructions: string;
  };
}

export const livekitApi = {
  async getRooms(): Promise<{ rooms: LiveKitRoom[] }> {
    return apiClient.get<{ rooms: LiveKitRoom[] }>('/lives/livekit/rooms');
  },

  async createRoom(roomName: string, maxParticipants = 500): Promise<{ message: string; room: LiveKitRoom }> {
    return apiClient.post('/lives/livekit/room', { roomName, maxParticipants });
  },

  async deleteRoom(roomName: string): Promise<{ message: string }> {
    return apiClient.delete(`/lives/livekit/room/${roomName}`);
  },

  async getToken(roomName: string, participantName: string, isHost: boolean): Promise<LiveKitToken> {
    return apiClient.post('/lives/livekit/token', { roomName, participantName, isHost });
  },

  async getObsConfig(roomName = 'mykog-live', hostName = 'obs-broadcaster'): Promise<LiveKitObsConfig> {
    return apiClient.post('/lives/livekit/obs-config', { roomName, hostName });
  },
};
