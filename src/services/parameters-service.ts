import axiosInstance from "@/lib/api/axios";
import type { Parameter } from "@/types/testparameters";

//parameter
export const getAllParameters = async (): Promise<Parameter[]> => {
  const response = await axiosInstance.get<Parameter[]>("/api/Parameter");
  return response.data;
};

export const getParameterById = async (id: number): Promise<Parameter> => {
  const response = await axiosInstance.get<Parameter>(`/api/Parameter/${id}`);
  return response.data;
};

export const createParameter = async (parameter: Omit<Parameter, "parameterId">): Promise<Parameter> => {
  const response = await axiosInstance.post<Parameter>("/api/Parameter", parameter);
  return response.data;
};

export const updateParameter = async (id: number, parameter: Omit<Parameter, "parameterId">): Promise<Parameter> => {
  const response = await axiosInstance.put<Parameter>(`/api/Parameter/${id}`, parameter);
  return response.data;
};

export const deleteParameter = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/Parameter/${id}`);
};

export const createMultipleParameters = async (parameters: Omit<Parameter, "parameterId">[]): Promise<Parameter[]> => {
  const response = await axiosInstance.post<Parameter[]>("/api/Parameter/create-list", parameters);
  return response.data;
};
