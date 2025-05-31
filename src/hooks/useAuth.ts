import { loginService, registerService } from '@/services/auth_service';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const registerMutation = useMutation({
    mutationFn: registerService,
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
  });

  return {
    registerMutation,
    loginMutation,
  };
};
