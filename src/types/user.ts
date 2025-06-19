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

type UserRole = 'Guest' | 'Customer' | 'Staff' | 'Manager' | 'Admin';

export type { User, UserRole };
