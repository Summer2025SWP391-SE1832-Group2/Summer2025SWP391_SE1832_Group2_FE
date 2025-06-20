export type ResultDetail = {
  testParameterId: number;
  name: string;
  value: string;
  sampleId: number;
  unit: string;
  description: string;
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
