import {
  loginService,
  registerService,
  requestResetPassword,
  confirmResetPassword,
} from '@/services/auth_service';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const registerMutation = useMutation({
    mutationFn: registerService,
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
  });

  // First step: Request reset password (sends email with verification code)
  const requestResetPasswordMutation = useMutation({
    mutationFn: requestResetPassword,
  });

  // Second step: Confirm reset password with verification code
  const confirmResetPasswordMutation = useMutation({
    mutationFn: confirmResetPassword,
  });

  return {
    registerMutation,
    loginMutation,
    requestResetPasswordMutation,
    confirmResetPasswordMutation,
  };
};
