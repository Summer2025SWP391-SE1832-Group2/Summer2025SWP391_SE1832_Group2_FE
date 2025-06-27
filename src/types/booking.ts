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

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type PaymentStatus = 'Unpaid' | 'Processing' | 'Paid' | 'Failed';

type Booking = {
  fullName: string;
  bookingId: number;
  serviceId: number;
  userId: number;
  bookingDate: string;
  status: BookingStatus;
  buyKit: boolean;
  method: BookingFormValues['method'];
  paymentStatus: PaymentStatus;
  preferredDate: string;
  collectionDate: string;
  time: string;
  location: string;
  resultDetails: [];
  finalResult: string;
};

type BookingRequest = {
  bookingId?: number;
  serviceId: number;
  userId: number;
  bookingDate: string;
  status: BookingStatus;
  buyKit: boolean;
  method: BookingFormValues['method'];
  paymentStatus: PaymentStatus;
  collectionDate: string;
  time: string;
  location: string;
};

// ✅ Mapping trạng thái sang tiếng Việt
export const bookingStatusMap: Record<BookingStatus, string> = {
  Pending: 'Đang chờ',
  Confirmed: 'Đã xác nhận',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
};

export const paymentStatusMap: Record<PaymentStatus, string> = {
  Unpaid: 'Chưa thanh toán',
  Processing: 'Đang xử lý',
  Paid: 'Đã thanh toán',
  Failed: 'Thanh toán thất bại',
};

export {
  type BookingRequest,
  type BookingStatus,
  type PaymentStatus,
  type Booking,
  type BookingSchedule,
  type SampleCollectionSchedule,
};
