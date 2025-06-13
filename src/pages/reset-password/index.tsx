import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import {
  resetPasswordFormDefaultValues,
  resetPasswordFormSchema,
  resetPasswordVerifySchema,
  type ResetPasswordFormValues,
} from '@/lib/zod/resetPassword';
import { paths } from '@/utils/constant/path';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const { requestResetPasswordMutation, confirmResetPasswordMutation } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Use different schema based on step
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(step === 'request' ? resetPasswordFormSchema : resetPasswordVerifySchema),
    defaultValues: resetPasswordFormDefaultValues,
  });

  // Update validation schema when step changes
  useEffect(() => {
    form.clearErrors();
  }, [step, form]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      if (step === 'request') {
        // First step: Request reset password (sends email with verification code)
        await requestResetPasswordMutation.mutateAsync({
          email: data.email,
          newPassword: data.newPassword,
        });

        setStep('verify');
        showToast('Mã xác nhận đã được gửi đến email của bạn!', 'success');
      } else {
        // Second step: Confirm reset password with verification code
        await confirmResetPasswordMutation.mutateAsync({
          email: data.email,
          newPassword: data.newPassword,
          verifyCode: data.verifyCode || '',
        });

        showToast('Đặt lại mật khẩu thành công!', 'success');
        navigate(paths.login);
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  };

  const isPending =
    requestResetPasswordMutation.isPending || confirmResetPasswordMutation.isPending;
  const isError = requestResetPasswordMutation.isError || confirmResetPasswordMutation.isError;
  const error = requestResetPasswordMutation.error || confirmResetPasswordMutation.error;

  return (
    <div className='flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-purple-50'>
      <Card className='shadow-lg w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-white font-bold text-xl'>DNA</span>
          </div>
          <CardTitle className='text-2xl'>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            {step === 'request'
              ? 'Nhập thông tin để đặt lại mật khẩu của bạn'
              : 'Nhập mã xác nhận đã được gửi đến email của bạn'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {isError && (
                <div className='rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-start'>
                  <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                  <span>
                    {error?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.'}
                  </span>
                </div>
              )}

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập email'
                        disabled={isPending || step === 'verify'}
                        readOnly={step === 'verify'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Nhập mật khẩu mới'
                          disabled={isPending || step === 'verify'}
                          readOnly={step === 'verify'}
                          {...field}
                        />
                        <button
                          type='button'
                          className='absolute right-3 top-3 text-muted-foreground'
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                          disabled={step === 'verify'}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='Xác nhận mật khẩu mới'
                          disabled={isPending || step === 'verify'}
                          readOnly={step === 'verify'}
                          {...field}
                        />
                        <button
                          type='button'
                          className='absolute right-3 top-3 text-muted-foreground'
                          onClick={toggleConfirmPasswordVisibility}
                          tabIndex={-1}
                          disabled={step === 'verify'}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {step === 'verify' && (
                <FormField
                  control={form.control}
                  name='verifyCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã xác nhận</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập mã xác nhận'
                          disabled={isPending}
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending
                  ? 'Đang xử lý...'
                  : step === 'request'
                  ? 'Gửi yêu cầu'
                  : 'Xác nhận đặt lại mật khẩu'}
              </Button>

              {step === 'verify' && (
                <Button
                  type='button'
                  variant='outline'
                  className='w-full mt-2'
                  onClick={() => setStep('request')}
                  disabled={isPending}
                >
                  Quay lại điền thông tin
                </Button>
              )}
            </form>
          </Form>

          <div className='mt-6 text-center text-sm'>
            <Link to={paths.login} className='text-primary hover:underline font-medium'>
              Quay lại đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
