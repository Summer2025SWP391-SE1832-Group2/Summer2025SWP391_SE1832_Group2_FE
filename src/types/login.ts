import type { UserRole } from './user';

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

type JwtPayload = {
  UserId: string;
  FullName: string;
  Email: string;
  Role: UserRole;
  exp: number;
};
export type { LoginRequest, LoginResponse, JwtPayload };
