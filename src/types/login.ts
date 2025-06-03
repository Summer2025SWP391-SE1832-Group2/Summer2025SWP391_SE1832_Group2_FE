type LoginRequest = {
  email: string;
  password: string;
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

export type { LoginRequest, LoginResponse };
