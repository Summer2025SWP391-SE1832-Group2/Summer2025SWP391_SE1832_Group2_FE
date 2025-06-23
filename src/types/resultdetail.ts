export type ResultDetail = {
  testParameterId: number;
  name: string;
  value: string;
  sampleId: number;
  unit: string;
  description: string;
  resultDetailId: string;
  parameterName: string;
};

export type ResultItem = {
  resultDetailId: number;
  bookingId: number;
  testParameterId: number;
  parameterName: string;
  value: string;
  sampleId: number;
};

export type CreateResultDetail = {
  bookingId: number;
  finalResult: string;
  results: ResultItem[];
};
