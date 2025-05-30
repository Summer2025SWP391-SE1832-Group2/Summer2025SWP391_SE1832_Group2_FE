type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
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

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string | null;
    expiredAt: string;
  };
};

export type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse };
