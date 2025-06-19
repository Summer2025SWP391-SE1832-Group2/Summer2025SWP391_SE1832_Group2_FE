import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import {
  profileFormDefaultValues,
  profileFormSchema,
  type ProfileFormValues,
} from '@/lib/zod/profile';
import type { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon, Save, User as UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const ProfilePage = () => {
  const { profile, isLoading, isError, error, updateProfile, isUpdating, updateError } =
    useProfile();
  const { showToast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profileFormDefaultValues,
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        gender: (profile.gender as 'male' | 'female' | 'other') || '',
        dateOfBirth: new Date(profile.dateOfBirth) || new Date(),
        identityNumber: profile.identityNumber || '',
        address: profile.address || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!profile) return;

    try {
      const updateData: User = {
        ...profile,
        ...data,
        dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd'),
      };

      await updateProfile(updateData);
      showToast('Cập nhật thông tin thành công!', 'success');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi cập nhật thông tin.';
      showToast(errorMessage, 'error');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
          <p className='text-sm text-muted-foreground'>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <AlertCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
              <h3 className='text-lg font-semibold mb-2'>Không thể tải thông tin</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                {error?.message || 'Có lỗi xảy ra khi tải thông tin người dùng.'}
              </p>
              <Button onClick={() => window.location.reload()} variant='outline'>
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8 px-4 max-w-2xl'>
      <Card>
        <CardHeader>
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center'>
              <UserIcon className='h-6 w-6 text-white' />
            </div>
            <div>
              <CardTitle className='text-2xl'>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {updateError && (
                <div className='rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-start'>
                  <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                  <span>{updateError?.message || 'Có lỗi xảy ra khi cập nhật thông tin.'}</span>
                </div>
              )}

              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên *</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập họ và tên' disabled={isUpdating} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập số điện thoại'
                          disabled={isUpdating}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                        disabled={isUpdating}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn giới tính' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='male'>Nam</SelectItem>
                          <SelectItem value='female'>Nữ</SelectItem>
                          <SelectItem value='other'>Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            captionLayout='dropdown'
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='identityNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số CMND/CCCD</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập số CMND/CCCD'
                        disabled={isUpdating}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập địa chỉ'
                        disabled={isUpdating}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='pt-4'>
                <Button type='submit' className='w-full md:w-auto' disabled={isUpdating}>
                  <Save className='h-4 w-4 mr-2' />
                  {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Display current profile info for reference */}
      {profile && (
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle className='text-lg'>Thông tin hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='font-medium text-muted-foreground'>Email:</span>
                <p>{profile.email}</p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>Vai trò:</span>
                <p>{profile.role}</p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>ID người dùng:</span>
                <p>{profile.userId}</p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>Số điện thoại:</span>
                <p>{profile.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>Giới tính:</span>
                <p>
                  {profile.gender === 'male'
                    ? 'Nam'
                    : profile.gender === 'female'
                    ? 'Nữ'
                    : profile.gender === 'other'
                    ? 'Khác'
                    : 'Chưa cập nhật'}
                </p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>Ngày sinh:</span>
                <p>{profile.dateOfBirth || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>Số CMND/CCCD:</span>
                <p>{profile.identityNumber || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <span className='font-medium text-muted-foreground'>Địa chỉ:</span>
                <p>{profile.address || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
