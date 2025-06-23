import axiosInstance from '@/lib/api/axios';
import type { Sample } from '@/types/sample';


// Create 
export const createSampleService = async (data: Omit<Sample, 'serviceId'>): Promise<void> => {
  await axiosInstance.post('/api/Sample', data);
};

// Update
export const updateSampleService = async (data: Sample): Promise<void> => {
  await axiosInstance.put('/api/Sample', data);
};

// Delete 
export const deleteSampleService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/Sample/${id}`);
};

//Get
export const getSamplesByBookingId = async (bookingId: number): Promise<Sample[]> => {
  const response = await axiosInstance.get<Sample[]>(`/api/Sample/by-booking-id/${bookingId}`);
  return response.data;
};