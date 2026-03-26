import { apiClient } from './client';
import { TextResume, ApiResponse } from '@/types';

export const textResumesApi = {
  async getAll(): Promise<TextResume[]> {
    return apiClient.get<TextResume[]>('/text-resumes');
  },

  async getById(id: string): Promise<TextResume> {
    return apiClient.get<TextResume>(`/text-resumes/${id}`);
  },

  async create(formData: FormData): Promise<ApiResponse<TextResume>> {
    return apiClient.post<ApiResponse<TextResume>>('/text-resumes', formData, true);
  },

  async update(id: string, formData: FormData): Promise<ApiResponse<TextResume>> {
    return apiClient.put<ApiResponse<TextResume>>(`/text-resumes/${id}`, formData, true);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/text-resumes/${id}`);
  },
};

