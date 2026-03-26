import { apiClient } from './client';
import { Enseignement, ApiResponse } from '@/types';

export const enseignementsApi = {
  async getAll(): Promise<Enseignement[]> {
    return apiClient.get<Enseignement[]>('/enseignements');
  },

  async create(formData: FormData): Promise<ApiResponse<Enseignement>> {
    return apiClient.post<ApiResponse<Enseignement>>('/enseignements', formData, true);
  },

  async update(id: string, data: Partial<Enseignement> | FormData, isFormData: boolean = false): Promise<ApiResponse<Enseignement>> {
    return apiClient.put<ApiResponse<Enseignement>>(`/enseignements/${id}`, data, isFormData);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/enseignements/${id}`);
  },
};

