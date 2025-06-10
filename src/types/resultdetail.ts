export type ResultDetail = {
  resultDetailId: number;
  bookingId: number;
  testParameterId: number;
  value: string;
  sampleId: number;
};
export type ResultItem = {
  testParameterId: number;
  value: string;
  sampleId: number;
};

export type CreateResultDetail = {
  bookingId: number;
  results: ResultItem[];
};
