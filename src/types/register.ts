type RegisterRequest = {
  password: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  verificationCode?: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  data: string;
};

export type { RegisterRequest, RegisterResponse };
