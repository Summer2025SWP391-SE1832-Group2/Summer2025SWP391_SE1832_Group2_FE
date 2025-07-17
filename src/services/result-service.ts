import axiosInstance from '@/lib/api/axios';
import type { CreateResultDetail, SaveResultPayload } from '@/types/resultdetail';
import type { ResultDetail } from '@/types/resultdetail';

export const getResultDetailsByBookingId = async (
  bookingId: number
): Promise<ResultDetail[]> => {
  const response = await axiosInstance.get<ResultDetail[]>(
    `/api/ResultDetail/${bookingId}/getAllResultByBookingId`
  );
  return response.data;
};


export const createMultipleResultDetails = async (data: CreateResultDetail): Promise<void> => {
  await axiosInstance.post("/api/ResultDetail/createMultipleResults", data);
};

export const updateMultipleResultDetails = (data: SaveResultPayload) => {
  return axiosInstance.put('/api/ResultDetail/updateMultipleResults', data);
};


export const getResultDetailsBySampleId = async (
  sampleId: number
): Promise<ResultDetail[]> => {
  const response = await axiosInstance.get<ResultDetail[]>(
    `/api/ResultDetail/sample/${sampleId}`
  );
  return response.data;
};

export const deleteResultDetail = async (
  resultDetailId: number
): Promise<void> => {
  await axiosInstance.delete(`/api/ResultDetail/${resultDetailId}`);
};


export const deleteResultDetailsByBookingId = async (
  bookingId: number
): Promise<void> => {
  await axiosInstance.delete(`/api/ResultDetail/booking/${bookingId}`);
};

