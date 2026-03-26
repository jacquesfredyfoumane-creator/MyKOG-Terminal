import { apiClient } from './client';
import { Annonce, ApiResponse } from '@/types';

export const annoncesApi = {
  async getAll(): Promise<Annonce[]> {
    return apiClient.get<Annonce[]>('/annonces');
  },

  async create(data: Omit<Annonce, 'id' | 'dateCreation'>): Promise<ApiResponse<Annonce>> {
    return apiClient.post<ApiResponse<Annonce>>('/annonces', data);
  },
};

