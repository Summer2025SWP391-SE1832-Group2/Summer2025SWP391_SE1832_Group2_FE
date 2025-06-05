export type UserStaff = {
    userId: number;
    fullName: string;
    email: string;
    phone: string | null;
    passwordHash: string;
    role: "Staff" | "Admin" | "Customer" | string; // hoặc thay đổi theo role bạn dùng
    gender: "male" | "female" | string;
    dateOfBirth: string; // hoặc `Date` nếu bạn convert khi nhận
  };
  
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
