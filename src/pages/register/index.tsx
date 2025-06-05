import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import {
  registerFormDefaultValues,
  registerRequestSchema,
  registerVerifyDefaultValues,
  registerVerifySchema,
  type RegisterFormValues,
  type RegisterVerifyValues,
} from '@/lib/zod/register';
import { paths } from '@/utils/constant/path';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerMutation } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  // Form for initial registration (first step)
  const requestForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: registerFormDefaultValues,
  });

  // Form for verification code (second step)
  const verifyForm = useForm<RegisterVerifyValues>({
    resolver: zodResolver(registerVerifySchema),
    defaultValues: registerVerifyDefaultValues,
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle first step submission
  const onRequestSubmit = async (data: RegisterFormValues) => {
    const { confirmPassword, ...rest } = data;
    try {
      const response = await registerMutation.mutateAsync(rest);

      if (response.data === 'Verification code has sent to email.') {
        showToast(response.data || 'Mã xác minh đã được gửi đến email!', 'success');
        // Transfer form values from first step to second step
        verifyForm.reset({
          ...data,
        });
        setVerificationSent(true);
      }
    } catch (error: any) {
      showToast(error?.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  };

  // Handle second step submission
  const onVerifySubmit = async (data: RegisterVerifyValues) => {
    const { confirmPassword, ...rest } = data;
    try {
      const response = await registerMutation.mutateAsync({
        ...rest,
        verificationCode: data.verificationCode.toString(),
      });
      if (response.data === 'Register User Successfully') {
        navigate(paths.login);
        showToast(response.message || 'Đăng ký thành công!', 'success');
      }
    } catch (error: any) {
      showToast(error?.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <div className='flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-purple-50'>
      <Card className='shadow-lg w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-white font-bold text-xl'>DNA</span>
          </div>
          <CardTitle className='text-2xl'>
            {!verificationSent ? 'Đăng ký tài khoản' : 'Xác minh tài khoản'}
          </CardTitle>
          <CardDescription>
            {!verificationSent
              ? 'Tạo tài khoản BloodLine DNA để sử dụng dịch vụ'
              : 'Nhập mã xác minh được gửi đến email của bạn'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!verificationSent ? (
            // First step form - Initial registration
            <Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className='space-y-4'>
                {registerMutation.isError && (
                  <div className='rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-start'>
                    <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                    <span>
                      {registerMutation.error?.message ||
                        'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'}
                    </span>
                  </div>
                )}

                <FormField
                  control={requestForm.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập họ và tên đầy đủ'
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Nhập địa chỉ email'
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          type='tel'
                          placeholder='Nhập số điện thoại (VD: 0912345678)'
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Nhập mật khẩu'
                            disabled={registerMutation.isPending}
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 text-muted-foreground'
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Nhập lại mật khẩu'
                            disabled={registerMutation.isPending}
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 text-muted-foreground'
                            onClick={toggleConfirmPasswordVisibility}
                            tabIndex={-1}
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

                <div className='text-xs text-muted-foreground'>
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <a href='#' className='text-primary hover:underline'>
                    Điều khoản dịch vụ
                  </a>
                  và
                  <a href='#' className='text-primary hover:underline'>
                    Chính sách bảo mật
                  </a>
                  của chúng tôi.
                </div>

                <Button type='submit' className='w-full' disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? 'Đang gửi...' : 'Tạo tài khoản'}
                </Button>
              </form>
            </Form>
          ) : (
            // Second step form - Verification code
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className='space-y-4'>
                {registerMutation.isError && (
                  <div className='rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-start'>
                    <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                    <span>
                      {registerMutation.error?.message ||
                        'Có lỗi xảy ra khi xác minh. Vui lòng thử lại.'}
                    </span>
                  </div>
                )}

                <div className='text-center text-sm text-muted-foreground mb-4'>
                  Mã xác minh đã được gửi đến email:{' '}
                  <strong>{verifyForm.getValues('email')}</strong>
                </div>
                <FormField
                  control={requestForm.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập họ và tên đầy đủ'
                          {...field}
                          disabled={registerMutation.isPending || verificationSent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Nhập địa chỉ email'
                          disabled={registerMutation.isPending || verificationSent}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          type='tel'
                          placeholder='Nhập số điện thoại (VD: 0912345678)'
                          disabled={registerMutation.isPending || verificationSent}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Nhập mật khẩu'
                            disabled={registerMutation.isPending || verificationSent}
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 text-muted-foreground'
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={requestForm.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Nhập lại mật khẩu'
                            disabled={registerMutation.isPending || verificationSent}
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 text-muted-foreground'
                            onClick={toggleConfirmPasswordVisibility}
                            tabIndex={-1}
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

                <FormField
                  control={verifyForm.control}
                  name='verificationCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã xác minh</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập mã 6 số từ email'
                          disabled={registerMutation.isPending}
                          maxLength={6}
                          className='text-center text-lg tracking-widest'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full' disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? 'Đang xác minh...' : 'Xác minh và hoàn tất đăng ký'}
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  disabled={registerMutation.isPending}
                  onClick={() => setVerificationSent(false)}
                >
                  Quay lại bước trước
                </Button>
              </form>
            </Form>
          )}

          <div className='mt-6 text-center text-sm'>
            <span className='text-muted-foreground'>Đã có tài khoản? </span>
            <Link to={paths.login} className='text-primary hover:underline font-medium'>
              Đăng nhập ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
