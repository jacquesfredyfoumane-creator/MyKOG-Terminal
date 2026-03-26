import { apiClient } from './client';
import { CalendarEvent, ApiResponse } from '@/types';

export const calendarApi = {
  async getAll(): Promise<CalendarEvent[]> {
    return apiClient.get<CalendarEvent[]>('/calendar');
  },

  async getByYear(year: number): Promise<CalendarEvent[]> {
    return apiClient.get<CalendarEvent[]>(`/calendar/year/${year}`);
  },

  async getById(id: string): Promise<CalendarEvent> {
    return apiClient.get<CalendarEvent>(`/calendar/${id}`);
  },

  async create(event: CalendarEvent): Promise<ApiResponse<CalendarEvent>> {
    return apiClient.post<ApiResponse<CalendarEvent>>('/calendar', event);
  },

  async update(id: string, event: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    return apiClient.put<ApiResponse<CalendarEvent>>(`/calendar/${id}`, event);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/calendar/${id}`);
  },
};

