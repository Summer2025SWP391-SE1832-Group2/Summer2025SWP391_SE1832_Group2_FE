import axiosInstance from '@/lib/api/axios';
import type { Sample, NewSample } from '@/types/sample';

// Get all sample services
export const getAllSampleServices = async (): Promise<Sample[]> => {
  const response = await axiosInstance.get<Sample[]>('/api/Sample');
  return response.data;
};

// Get a sample service by ID
export const getSampleServiceById = async (id: number): Promise<Sample> => {
  const response = await axiosInstance.get<Sample>(`/api/Sample/${id}`);
  return response.data;
};

// Create a new sample service
export const createSampleService = async (data: NewSample): Promise<void> => {
  await axiosInstance.post('/api/Sample', data);
};

// Update an existing sample service
export const updateSampleService = async (data: Sample): Promise<void> => {
  await axiosInstance.put('/api/Sample', data);
};

// Delete a sample service by ID
export const deleteSampleService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/Sample/${id}`);
};

// Get samples by Booking ID
export const getSamplesByBookingId = async (bookingId: number): Promise<Sample[]> => {
  const response = await axiosInstance.get<Sample[]>(`/api/Sample/by-booking-id/${bookingId}`);
  return response.data;
};


export const updateSamplePictureService = async (
  sampleId: number,
  picture: string
): Promise<void> => {
  await axiosInstance.put('/api/Sample/update-picture-and-booking-status', {
    sampleId,
    picture,
  });
};