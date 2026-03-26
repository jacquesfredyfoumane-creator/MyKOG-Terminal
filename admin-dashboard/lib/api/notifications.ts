import { apiClient } from './client';
import { ApiResponse } from '@/types';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  type?: 'general' | 'calendar' | 'teaching' | 'live' | 'annonce';
}

export interface SendNotificationResponse {
  message: string;
  sent: number;
  failed: number;
  total: number;
}

export const notificationsApi = {
  async sendToAll(payload: NotificationPayload): Promise<SendNotificationResponse> {
    return apiClient.post<SendNotificationResponse>('/notifications/send/all', payload);
  },

  async sendToUser(userId: string, payload: NotificationPayload): Promise<SendNotificationResponse> {
    return apiClient.post<SendNotificationResponse>('/notifications/send/user', {
      userId,
      ...payload,
    });
  },

  async sendToTopic(topic: string, payload: NotificationPayload): Promise<ApiResponse<{ messageId: string }>> {
    return apiClient.post<ApiResponse<{ messageId: string }>>('/notifications/send/topic', {
      topic,
      ...payload,
    });
  },
};

