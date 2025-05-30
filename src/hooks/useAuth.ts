import { useToast } from '@/components/ui/toast';
import { loginService, registerService } from '@/services/auth_service';
import type { RegisterRequest } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const { showToast } = useToast();
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await registerService(data);
      return response;
    },
    onSuccess: (response) => {
      return response;
    },
    onError: (error: any) => {
      showToast(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (response) => {
      showToast(response.message || 'Đăng nhập thành công!', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.', 'error');
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
};
