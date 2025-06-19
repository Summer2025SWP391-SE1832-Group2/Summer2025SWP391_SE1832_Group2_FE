import type { JwtPayload } from '@/types/login';
import { jwtDecode } from 'jwt-decode';

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Helper function to get userId from token
const getUserIdFromToken = (token: string): number => {
  const decoded = jwtDecode<JwtPayload>(token);
  return Number(decoded.UserId);
};

export { isTokenExpired, getUserIdFromToken };
