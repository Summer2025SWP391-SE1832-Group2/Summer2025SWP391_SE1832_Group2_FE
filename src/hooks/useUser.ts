import {
  getFilteredUsers,
  getUserRequestById,
  updateUserRequest,
  updateUserRole,
} from '@/services/user_service';
import { useAuthStore } from '@/stores/auth';
import type { User, UserRole } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useUser = () => {
  const { user: authUser, refreshUser } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = authUser?.userId;

  // Query to fetch user profile data
  const getUserQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserRequestById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to update user profile
  const updateUserMutation = useMutation({
    mutationFn: (data: User) => updateUserRequest(data),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      // Also refresh user data in auth store
      refreshUser();
    },
  });

  // Query to fetch filtered users (default to role 3 - Staff)
  const queryUsersByRole = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getFilteredUsers({ roleId: userId! }),
  });

  // Mutation to update user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: number; newRole: UserRole }) =>
      updateUserRole(userId, newRole),
    onSuccess: () => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    getUserQuery,
    updateUserMutation,
    queryUsersByRole,
    updateRoleMutation,
  };
};
