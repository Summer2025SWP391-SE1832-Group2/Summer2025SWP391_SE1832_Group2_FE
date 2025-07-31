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
  serviceName: string;
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
  orderCode?: number;
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

type BookingStatus = 'Đang chờ xử lý' | 'Đã lấy mẫu' | 'Hoàn thành';
type PaymentStatus = 'Đã thanh toán' | 'Chưa thanh toán';

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

export { type BookingRequest, type BookingStatus, type PaymentStatus, type Booking };
