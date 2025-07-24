type TestParameter = {
  testParameterId: number;
  serviceId: number;
  parameterId: number;
  displayOrder: number;
  name: string;
  unit?: string;
  description?: string;
};

type Parameter = {
  parameterId: number;
  name: string;
  unit: string;
  description: string;
}
export type { TestParameter };
export type { Parameter };