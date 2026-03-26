import { apiClient } from './client';
import { User, UserStats, ApiResponse } from '@/types';

export const usersApi = {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  },

  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async createOrUpdate(user: User): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/users', user);
  },

  async update(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, user);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  async getStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/users/stats');
  },
};

