import { loginService, registerService } from '@/services/auth_service';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      // Handle successful registration, e.g., redirect or show a success message
      console.log('Registration successful:', data);
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
    onError: (error) => {
      // Handle login error, e.g., show an error message
      console.error('Login failed:', error);
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
};
