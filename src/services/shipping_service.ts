import type { Shipping } from "@/types/shipping";
import axiosInstance from "@/lib/api/axios";

const getListShippingByBookingId = async (bookingId: number): Promise<Shipping[]> => {
    const response = await axiosInstance.get<Shipping[]>(`/api/ShippingOrder/by-booking/${bookingId}`);
    console.log("Shipping response:", response.data);
    return response.data;
}
const updateShipping = async (data: Shipping) => {
    console.log("Update Shipping data:", data);
    const response = await axiosInstance.post<string>('/api/ShippingOrder', data);
    console.log("Update Shipping response:", response.data);
    return response.data;
  };
export { getListShippingByBookingId,updateShipping };