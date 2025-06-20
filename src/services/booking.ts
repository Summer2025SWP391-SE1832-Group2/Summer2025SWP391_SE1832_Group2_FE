import axiosInstance from '@/lib/api/axios';
import type { BookingRequest } from '@/types/booking';

const createBooking = async (data: BookingRequest) => {
  const response = await axiosInstance.post<string>('/api/Booking', data);
  return response.data;
};

const checkExistingNearBooking = async (userId: number) => {
  const response = await axiosInstance.get<boolean>(`checkPending?userId=${userId}`);
  return response.data;
};

export { createBooking, checkExistingNearBooking };
