'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getUserRequestById,
  updateUserRequest,
} from '@/services/user_service';

import type { UserRequest, UserResponse } from '@/types/user';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { endOfDay, format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/stores/auth';
import { CustomCalendar } from '@/components/common/CustomCalendar';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const { register, handleSubmit, setValue, watch, reset } = useForm<UserRequest>();
  const dateOfBirth = watch('dateOfBirth');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserRequestById();
        reset(data);
      } catch (error) {
        console.error('Không lấy được thông tin user:', error);
        showToast('Không lấy được thông tin người dùng', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchUser();
  }, [user?.userId]);

  const onSubmit = async (data: UserRequest) => {
    try {
      setSaving(true);
      const res: UserResponse = await updateUserRequest({
        ...data,
        userRequestId: user!.userId,
        
      });
console.log('Response:', res);

      if (res.success) {
        showToast(res.message || 'Cập nhật thất bại', 'error');
        return;
      }

      showToast(res.message || 'Cập nhật thành công!', 'success');
    } catch (error) {
      console.error('Lỗi cập nhật user:', error);
      showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className='py-20 px-4'>
      <div className='container mx-auto max-w-3xl'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label>Họ và tên</Label>
                <Input {...register('fullName')} />
              </div>

              <div>
                <Label>Email</Label>
                <Input {...register('email')} readOnly />
              </div>

              <div>
                <Label>Số điện thoại</Label>
                <Input type='tel' {...register('phone')} />
              </div>
              {/* 
              <div>
                <Label>Vai trò</Label>
                <Input {...register('role')} readOnly />
              </div> */}

              <div>
                <Label>Giới tính</Label>
                <Select
                  value={watch('gender')}
                  onValueChange={(value) => setValue('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='male'>Nam</SelectItem>
                    <SelectItem value='female'>Nữ</SelectItem>
                    <SelectItem value='other'>Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ngày sinh</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      {dateOfBirth
                        ? format(new Date(dateOfBirth), 'dd/MM/yyyy', { locale: vi })
                        : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <CustomCalendar
                      mode='single'
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                       disabled={{ after: endOfDay(new Date()) }}
                      selected={dateOfBirth ? new Date(dateOfBirth) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, 'yyyy-MM-dd');
                          setValue('dateOfBirth', formatted);
                        }
                      }}
                      initialFocus
                    />

                  </PopoverContent>
                </Popover>
              </div>

              <Button className='w-full' type='submit' disabled={saving || loading}>
                {saving ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
