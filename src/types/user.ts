export type UserStaff = {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: "Staff" | "Admin" | "Customer" | string;
  gender: "male" | "female" | string;
  dateOfBirth: string;
};

type UserRequest = {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  dateOfBirth: string;
  personalId: string;
  address: string;
};

type User = {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
};

type UserRole = 'Guest' | 'Customer' | 'Staff' | 'Manager' | 'Admin';
export type { UserRequest, UserRole, User };
