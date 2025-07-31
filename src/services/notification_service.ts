import axiosInstance from '@/lib/api/axios';
import type { FcmTokenPayload } from '@/types/notification';
import type { Notification } from '@/types/notìication';

export const getNotifications = async (userId: number): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get(`/api/Auth/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/api/Auth/mark-as-read?notiID=${notificationId}`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const saveFcmToken = async (payload: FcmTokenPayload) => {
  try {
    const response = await axiosInstance.post<boolean>('/api/Auth/save-fcm-token', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to save FCM token:', error);
    throw error;
  }
};
export { saveFcmToken };
