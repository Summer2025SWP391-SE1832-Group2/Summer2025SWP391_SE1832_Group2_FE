export interface SampleCollectionSchedule {
  scheduleId: number;
  bookingId: number;
  collectorId: number;
  collectorName: string | null;
  collectionDate: string;
  time: string;
  location: string;
  status: string;
}
