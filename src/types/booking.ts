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
    serviceTypeId: number;
    userId: number;
    bookingDate: string;
    sampleMethod: string;
    status: string;
    paymentStatus: string;
    preferredDate: string;
    result: string;
  };
  export type { Booking,BookingSchedule, SampleCollectionSchedule };