export type Sample = {
  sampleId: number;
  bookingId: number;
  collectedBy: string;
  collectedDate: string; // ISO format
  sampleType: string;
  participantName: string;
  notes: string;
  picture: string; // URL or base64 string
  transport: string;
};

export type NewSample = Omit<Sample, 'sampleId'>;
