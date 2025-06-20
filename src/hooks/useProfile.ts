import { getUserRequestById, updateUserRequest } from '@/services/user_service';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProfile = () => {
  const { user: authUser, refreshUser } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = authUser?.userId;

  // Query to fetch user profile data
  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserRequestById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to update user profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: User) => updateUserRequest(data),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      // Also refresh user data in auth store
      refreshUser();
    },
  });

  return {
    profileQuery,
    updateProfileMutation,
  };
};
