import axiosInstance from "@/lib/api/axios";
import type { Booking, BookingSchedule } from "@/types/booking";
import type { UserStaff } from "@/types/user";

// Get all bookings
const getAllBookings = async (): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>("/api/Booking");
  return response.data;
};

const getAllBookingSchedule = async (): Promise<BookingSchedule[]> => {
    const response = await axiosInstance.get<BookingSchedule[]>("/BookingWithSchedule");
    console.log("ahiiii",response.data);
    return response.data;
  };

const getStaffForSchedule = async (id: number): Promise<UserStaff[]> => {
  const response = await axiosInstance.get<UserStaff[]>(`/api/SampleCollectionSchedule/${id}/available-staffs`);
  return response.data;
};

const AssignStaffForSchedule = async (id: number, idStaff: number): Promise<UserStaff[]> => {
  const response = await axiosInstance.put(`/api/SampleCollectionSchedule/AssignTask/${id}/${idStaff}`);
  return response.data;
};

// Get booking by ID
const getBookingById = async (id: number): Promise<Booking> => {
  const response = await axiosInstance.get<Booking>(`/api/Booking/${id}`);
  return response.data;
};

// Create a new booking
const createBooking = async (data: Omit<Booking, "bookingId">): Promise<Booking> => {
  const response = await axiosInstance.post<Booking>("/api/Booking", data);
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

export {
  getAllBookings,
  getAllBookingSchedule,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getStaffForSchedule,
  AssignStaffForSchedule,
  getBookingsByUserId
};
