type User = {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  identityNumber: string;
  address: string | null;
};

type UserRole =
  | 'Guest'
  | 'Customer'
  | 'Manager'
  | 'Admin'
  | 'FacilityStaff'
  | 'HomeStaff'
  | 'TestStaff'
  | 'ShipStaff';

export type { User, UserRole };
