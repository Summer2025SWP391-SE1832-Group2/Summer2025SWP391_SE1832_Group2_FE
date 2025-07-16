// Base shared type
type BaseService = {
  name: string;
  description: string;
  durationDays: number;
  price: number;
  isAtHome: boolean;
  isStaffSuport: boolean;
};

// Response type includes serviceId as required
type ServiceResponse = BaseService & {
  serviceId: string;
};

// Request type has serviceId optional (for create/update scenarios)
type ServiceRequest = BaseService & {
  serviceId?: string;
};

export { type ServiceResponse, type ServiceRequest };
