import type { UserRole } from '@/types/user-role';
import { getDefaultRouteByRole } from '@/utils/constant/path';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JwtPayload {
  UserId: string;
  FullName: string;
  Email: string;
  Role: UserRole;
  exp: number;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthActions {
  setAuth: (token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            set(initialState);
            return;
          }
          const user: User = {
            userId: decoded.UserId,
            fullName: decoded.FullName,
            email: decoded.Email,
            role: decoded.Role,
          };
          set({ token, user, isAuthenticated: true });
        } catch (error) {
          console.error('Error decoding token:', error);
          set(initialState);
        }
      },
      logout: () => {
        set(initialState);
      },
      clearAuth: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token;
        if (token) {
          state.setAuth(token);
        }
      },
    },
  ),
);
