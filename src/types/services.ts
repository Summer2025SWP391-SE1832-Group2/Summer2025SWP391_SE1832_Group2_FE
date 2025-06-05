// Base shared type
type BaseService = {
  name: string;
  description: string;
  durationDays: number;
  price: number;
  serviceTypeId: number;
  isAtHome: boolean;
  isStaffSuport: boolean;
};

// Response type includes serviceId as required
type ServiceResponse = BaseService & {
  serviceId: number;
};

// Request type has serviceId optional (for create/update scenarios)
type ServiceRequest = BaseService & {
  serviceId?: number;
};

export { type ServiceResponse, type ServiceRequest };
