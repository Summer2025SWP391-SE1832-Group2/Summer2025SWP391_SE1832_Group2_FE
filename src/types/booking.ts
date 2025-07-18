import type { BookingFormValues } from '@/lib/zod/booking';

// type SampleCollectionSchedule = {
//   scheduleId: number;
//   bookingId: number;
//   collectorId: number;
//   collectionDate: string;
//   time: string;
//   location: string;
//   status: string;
//   collectorName: string;
// };
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
  resultDetails: [];
  fullName?: string;
  finalResult?: string;
  hasSubmittedRating: boolean;
  sampleCollectionSchedules: {
    scheduleId: number;
    bookingId: number;
    collectorId: number;
    collectorName: string | null;
    collectionDate: string;
    time: string;
    location: string;
    status: string;
  }[];
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
  samples: {
    sampleType: string;
    participantName: string;
    notes: string;
  }[];
};

export const bookingStatusMap: Record<BookingStatus, string> = {
  Pending: 'Đang chờ',
  Confirmed: 'Đã xác nhận',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
};

export const paymentStatusMap: Record<PaymentStatus, string> = {
  Unpaid: 'Chưa thanh toán',
  Paid: 'Đã thanh toán',
  Failed: 'Thanh toán thất bại',
};

export { type BookingRequest, type BookingStatus, type PaymentStatus, type Booking };
