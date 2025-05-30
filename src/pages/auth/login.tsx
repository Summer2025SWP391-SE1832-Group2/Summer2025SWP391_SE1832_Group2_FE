'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { paths } from '@/utils/constant/path';
import { loginFormDefaultValues, loginFormSchema, type LoginFormValues } from '@/lib/zod/login';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className='flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-purple-50'>
      <Card className='shadow-lg min-w-[400px]'>
        <CardHeader className='text-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-white font-bold text-xl'>DNA</span>
          </div>
          <CardTitle className='text-2xl'>Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập vào tài khoản BloodLine DNA của bạn</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {loginMutation.isError && (
                <div className='rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-start'>
                  <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                  <span>
                    {loginMutation.error?.message ||
                      'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.'}
                  </span>
                </div>
              )}

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập email'
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Nhập mật khẩu'
                          disabled={loginMutation.isPending}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center justify-between text-sm'>
                <Link to={paths.forgotPassword} className='text-primary hover:underline'>
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </Form>

          <div className='mt-6 text-center text-sm'>
            <span className='text-muted-foreground'>Chưa có tài khoản? </span>
            <Link to={paths.register} className='text-primary hover:underline font-medium'>
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
