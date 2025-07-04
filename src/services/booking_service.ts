import axiosInstance from '@/lib/api/axios';
import type { Booking, BookingRequest } from '@/types/booking';
import type { User } from '@/types/user';

// Get all bookings
const getAllBookings = async (): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>('/api/Booking');
  return response.data;
};

const getAllBookingSchedule = async (): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>('/BookingWithSchedule');
  return response.data;
};

const getStaffForSchedule = async (id: number): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>(
    `/api/SampleCollectionSchedule/${id}/available-staffs`,
  );
  return response.data;
};

const AssignStaffForSchedule = async (id: number, idStaff: number): Promise<User[]> => {
  const response = await axiosInstance.put(
    `/api/SampleCollectionSchedule/AssignTask/${id}/${idStaff}`,
  );
  return response.data;
};

// Get booking by ID
const getBookingById = async (id: number): Promise<Booking> => {
  const response = await axiosInstance.get<Booking>(`/api/Booking/${id}`);
  return response.data;
};

// Create a new booking
const createBooking = async (data: BookingRequest) => {
  const response = await axiosInstance.post<string>('/api/Booking', data);
  return response.data;
};

// Update a booking (partial update)
const updateBooking = async (id: number, data: Partial<Booking>): Promise<Booking> => {
  const response = await axiosInstance.put<Booking>(`/api/Booking/${id}`, data);
  return response.data;
};

// Delete a booking
const deleteBooking = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/Booking/${id}`);
};
// [GET] /api/Booking/{UserId}/getByUserId
const getBookingsByUserId = async (userId: number): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>(`/api/Booking/${userId}/getByUserId`);
  return response.data;
};

const checkExistingNearBooking = async (userId: number) => {
  const response = await axiosInstance.get<boolean>(`checkPending?userId=${userId}`);
  return response.data;
};


export const getBookingsByCollectorId = async (collectorId: number): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>(`/api/Booking/by-collector/${collectorId}`);
  return response.data;
};

 const rePayment = async (bookingID: number) => {
  const response= await axiosInstance.post<string>(`/api/Booking/regenerate-qr/${bookingID}`);
  return response.data;
};

export {
  AssignStaffForSchedule,
  createBooking,
  deleteBooking,
  getAllBookings,
  getAllBookingSchedule,
  getBookingById,
  getBookingsByUserId,
  getStaffForSchedule,
  updateBooking,
  checkExistingNearBooking,
  rePayment,
};
