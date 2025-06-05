type UserRequest = {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  dateOfBirth: string;
};
type UserResponse = {
  success: boolean;
  message: string;
  data: string;
};

type User = {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
};

type UserRole = 'Guest' | 'Customer' | 'Staff' | 'Manager' | 'Admin';
export type { UserRequest, UserResponse, UserRole, User };
