export interface Sample {
  sampleId: number;
  bookingId: number;
  collectedBy: string;
  collectedDate: string; 
  sampleType: string;
  participantName: string;
  notes: string;
  picture: string;
  transport: string;
}
export type NewSample = Omit<Sample, 'sampleId'>;
