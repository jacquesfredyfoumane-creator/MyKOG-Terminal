import { apiClient } from './client';
import { LiveStream, ApiResponse } from '@/types';

type CreateLiveStreamData = Omit<LiveStream, 'id' | 'createdAt' | 'updatedAt' | 'scheduledAt' | 'startedAt' | 'endedAt'> & {
  scheduledAt?: string | Date | null;
};

export const livesApi = {
  async getAll(): Promise<LiveStream[]> {
    return apiClient.get<LiveStream[]>('/lives');
  },

  async getById(id: string): Promise<LiveStream> {
    return apiClient.get<LiveStream>(`/lives/${id}`);
  },

  async getActive(): Promise<LiveStream | null> {
    try {
      return await apiClient.get<LiveStream>('/lives/active');
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('Aucun live actif')) {
        return null;
      }
      throw error;
    }
  },

  async create(data: CreateLiveStreamData): Promise<ApiResponse<LiveStream>> {
    return apiClient.post<ApiResponse<LiveStream>>('/lives', data);
  },

  async update(id: string, data: Partial<CreateLiveStreamData>): Promise<ApiResponse<LiveStream>> {
    return apiClient.put<ApiResponse<LiveStream>>(`/lives/${id}`, data);
  },

  async updateStatus(id: string, status: 'scheduled' | 'live' | 'ended'): Promise<ApiResponse<LiveStream>> {
    return apiClient.put<ApiResponse<LiveStream>>(`/lives/${id}/status`, { status });
  },

  async delete(id: string): Promise<ApiResponse<LiveStream>> {
    return apiClient.delete<ApiResponse<LiveStream>>(`/lives/${id}`);
  },
};

