import { getUserRequestById } from '@/services/user_service';
import type { User } from '@/types/user';
import { getUserIdFromToken, isTokenExpired } from '@/utils/helper';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (token: string) => {
        try {
          // Validate token
          if (isTokenExpired(token)) {
            set(initialState);
            throw new Error('Token is expired');
          }

          // Set token and auth state
          set({ token, isAuthenticated: true, isLoading: true });

          // Fetch user details
          const userId = getUserIdFromToken(token);
          const userDetails = await getUserRequestById(userId);

          set({ user: userDetails, isLoading: false });
        } catch (error) {
          console.error('Login error:', error);
          set(initialState);
          throw error;
        }
      },

      refreshUser: async () => {
        const { token, isAuthenticated } = get();

        if (!isAuthenticated || !token) {
          console.warn('Cannot refresh user: not authenticated');
          return;
        }

        try {
          // Check if token is still valid
          if (isTokenExpired(token)) {
            set(initialState);
            return;
          }

          set({ isLoading: true });

          const userId = getUserIdFromToken(token);
          const userDetails = await getUserRequestById(userId);

          set({ user: userDetails, isLoading: false });
        } catch (error) {
          console.error('Refresh user error:', error);
          set({ isLoading: false });
          // Don't logout on refresh error, just log it
        }
      },

      logout: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Auto-login when browser reopens if token exists
          state.login(state.token).catch(() => {
            // If auto-login fails, clear the state
            state.logout();
          });
        }
      },
    },
  ),
);
