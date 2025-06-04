type UserRequest ={
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
export type { UserRequest, UserResponse };