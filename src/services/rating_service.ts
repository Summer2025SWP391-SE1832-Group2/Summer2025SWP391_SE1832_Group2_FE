import axiosInstance from '@/lib/api/axios';
import type { Rating } from '@/types/rating';

// Submit a rating for a booking
const submitRating = async (data: Rating): Promise<boolean> => {
  const response = await axiosInstance.post<boolean>('/api/Rating', data);
  return response.data;
};

// Get rating by booking ID
const getRatingByBookingId = async (bookingId: number): Promise<Rating[]> => {
  const response = await axiosInstance.get<Rating[]>(`/api/Rating/getbyBook/${bookingId}`);
  return response.data;
};

export { submitRating, getRatingByBookingId };
