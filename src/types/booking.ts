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
  status: BookingStatus;
  buyKit: boolean;
  method: ServiceMethod;
  paymentStatus: PaymentStatus;
  preferredDate: string;
  time: string;
  location: string;
  result: string;
};
//   export type { Booking,BookingSchedule, SampleCollectionSchedule };
type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type PaymentStatus = 'Unpaid' | 'Processing' | 'Paid' | 'Failed';
type ServiceMethod = 'AtFacility' | 'SelfCollection' | 'StaffVisit';

type BookingRequest = {
  bookingId?: number;
  serviceId: number;
  userId: number;
  bookingDate: string;
  status: BookingStatus;
  buyKit: boolean;
  method: ServiceMethod;
  paymentStatus: PaymentStatus;
  time: string;
  location: string;
};

export { type BookingRequest, type BookingStatus, type PaymentStatus, type ServiceMethod, type Booking, type BookingSchedule, type SampleCollectionSchedule };
