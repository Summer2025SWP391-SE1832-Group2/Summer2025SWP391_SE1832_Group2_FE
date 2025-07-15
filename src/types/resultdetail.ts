export type ResultDetail = {
  testParameterId: number;
  name: string;
  value: string;
  sampleId: number;
  unit: string;
  description: string;
  parameterName : string;
  pi: number;
};

export interface ResultItem {
  resultDetailId: number;
  bookingId: number;
  testParameterId: number;
  sampleId: number;
  parameterName: string;
  value: string;
}


export type CreateResultDetail = {
  bookingId: number;
  finalResult: string;
  results: ResultItem[];
};
