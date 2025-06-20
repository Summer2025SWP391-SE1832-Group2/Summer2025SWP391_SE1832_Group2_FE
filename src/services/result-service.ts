import axiosInstance from '@/lib/api/axios';
import type { ResultDetail, ResultItem } from '@/types/resultdetail';

export const getResultDetailsByBookingId = async (
  bookingId: number
): Promise<ResultDetail[]> => {
  const response = await axiosInstance.get<ResultDetail[]>(
    `/api/ResultDetail/${bookingId}/getAllResultByBookingId`
  );
  return response.data;
};

export const createMultipleResultDetails = async (
  bookingId: number,
  results: ResultItem[]
): Promise<any> => {
  const payload = {
    bookingId,
    results,
  };
  const response = await axiosInstance.post(
    "/api/ResultDetail/createMultipleResults",
    payload
  );
  return response.data;
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
