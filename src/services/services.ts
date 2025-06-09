import axiosInstance from '@/lib/api/axios';
import type { ServiceRequest, ServiceResponse } from '@/types/services';

const getAllServices = async () => {
  const response = await axiosInstance.get<ServiceResponse[]>('/api/Service');
  return response.data;
};

const getServiceById = async (id: number) => {
  const response = await axiosInstance.get<ServiceResponse>(`/api/Service/${id}`);
  return response.data;
};

const createService = async (data: ServiceRequest) => {
  const response = await axiosInstance.post<ServiceResponse>('/api/Service', data);
  return response.data;
};

const updateService = async (data: ServiceRequest) => {
  const response = await axiosInstance.put<ServiceResponse>(`/api/Service`, data);
  return response.data;
};

const deleteService = async (id: number) => {
  const response = await axiosInstance.delete<ServiceResponse>(`/api/Service/${id}`);
  return response.data;
};

export { getAllServices, createService, updateService, deleteService, getServiceById };
