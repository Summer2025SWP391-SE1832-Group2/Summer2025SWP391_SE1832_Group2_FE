import axiosInstance from '@/lib/api/axios';
import type { SampleCollectionSchedule } from '@/types/sampleCollectionSchedule';

// Lấy lịch thu mẫu theo bookingId
export const getCollectionScheduleByBookingId = async (bookingId: number): Promise<SampleCollectionSchedule> => {
  const response = await axiosInstance.get<SampleCollectionSchedule>(`/api/SampleCollectionSchedule/booking/${bookingId}`);
  return response.data;
};
