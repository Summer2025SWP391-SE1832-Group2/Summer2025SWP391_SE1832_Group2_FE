import axiosInstance from '@/lib/api/axios';
import type { FcmTokenPayload } from '@/types/notification';

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
