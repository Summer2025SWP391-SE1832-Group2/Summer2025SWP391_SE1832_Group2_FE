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

export { type BookingRequest, type BookingStatus, type PaymentStatus, type ServiceMethod };
