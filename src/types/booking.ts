import type { BookingFormValues } from '@/lib/zod/booking';

type SampleCollectionSchedule = {
  scheduleId: number;
  bookingId: number;
  collectorId: number;
  collectionDate: string;
  time: string;
  location: string;
  status: string;
};

type BookingSchedule = {
  bookingId: number;
  serviceTypeId: number;
  userId: number;
  bookingDate: string;
  sampleMethod: string;
  status: string;
  paymentStatus: string;
  preferredDate: string;
  result: string;
  sampleCollectionSchedules: SampleCollectionSchedule[];
};

type Booking = {
  bookingId: number;
  serviceId: number;
  userId: number;
  bookingDate: string;
  status?: string;
  buyKit: boolean;
  method: BookingFormValues['method'];
  paymentStatus: PaymentStatus;
  preferredDate: string;
  collectionDate: string;
  time: string;
  location: string;
  result: string;
};

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type PaymentStatus = 'Unpaid' | 'Paid' | 'Failed';

type BookingRequest = {
  bookingId?: number;
  serviceId: number;
  userId: number;
  bookingDate: string;
  status?: string;
  buyKit: boolean;
  method: BookingFormValues['method'];
  paymentStatus: PaymentStatus;
  collectionDate: string;
  time: string;
  location: string;
};

export {
  type BookingRequest,
  type BookingStatus,
  type PaymentStatus,
  type Booking,
  type BookingSchedule,
};
