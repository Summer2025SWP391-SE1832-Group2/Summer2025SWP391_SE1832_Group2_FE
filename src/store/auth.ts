import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'GUEST' | 'CUSTOMER' | 'STAFF' | 'MANAGER' | 'ADMIN';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (token: string) => {
        // const userInfo = getTokenInfo(token);
        // if (!userInfo || isTokenExpired(token)) {
        //   set(initialState);
        //   return;
        // }
        // set({
        //   token,
        //   user: userInfo,
        //   isAuthenticated: true,
        // });
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
      // Only store token in localStorage, other values will be derived from token
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
