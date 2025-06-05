import axiosInstance from '@/lib/api/axios';
import type { BookingRequest } from '@/types/booking';

const createBooking = async (data: BookingRequest) => {
  const response = await axiosInstance.post<string>('/api/Booking', data);
  return response.data;
};

export { createBooking };
