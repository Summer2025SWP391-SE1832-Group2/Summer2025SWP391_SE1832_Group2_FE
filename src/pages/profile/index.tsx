import { getUserRequestById, updateUserRequest } from '@/services/user_service';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { CustomCalendar } from '@/components/common/CustomCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/stores/auth';
import type { UserRequest } from '@/types/user';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const { register, handleSubmit, setValue, watch, reset } = useForm<UserRequest>();
  const dateOfBirth = watch('dateOfBirth');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserRequest | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserRequestById();
      reset(data);
      setUserData(data);
    } catch (error) {
      console.error('Không lấy được thông tin user:', error);
      showToast('Không lấy được thông tin người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (user?.userId) fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user?.userId]);

  const onSubmit = async (data: UserRequest) => {
  try {
    setSaving(true);
    const success = await updateUserRequest(data);

    if (!success) {
      showToast('Cập nhật thất bại', 'error');
      return;
    }

    showToast('Cập nhật thành công!', 'success');
    setIsEditing(false);
    setUserData(data); // cập nhật UI sau khi save
  } catch (error) {
    console.error('Lỗi cập nhật user:', error);
    showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p className='text-center'>Đang tải thông tin...</p>;

  return (
    <section className='py-20 px-4'>
      <div className='container mx-auto max-w-3xl'>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6 ml-5'>
            {!isEditing ? (
              <>
                <div>
                  <Label>Họ và tên</Label>
                  <p>{userData?.fullName || '—'}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{userData?.email || '—'}</p>
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <p>{userData?.phone || '—'}</p>
                </div>
                <div>
                  <Label>Giới tính</Label>
                  <p>
                    {userData?.gender === 'male'
                      ? 'Nam'
                      : userData?.gender === 'female'
                      ? 'Nữ'
                      : 'Khác'}
                  </p>
                </div>
                <div>
                  <Label>Ngày sinh</Label>
                  <p>
                    {userData?.dateOfBirth
                      ? format(new Date(userData.dateOfBirth), 'dd/MM/yyyy', { locale: vi })
                      : '—'}
                  </p>
                </div>
                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div>
                  <Label className='mb-2'>Họ và tên</Label>
                  <Input {...register('fullName')} />
                </div>

                <div>
                  <Label className='mb-2'>Email</Label>
                  <Input {...register('email')} readOnly />
                </div>

                <div>
                  <Label className='mb-2'>Số điện thoại</Label>
                  <Input type='tel' {...register('phone')} />
                </div>

                <div>
                  <Label className='mb-2'>Giới tính</Label>
                  <Select
                    value={watch('gender')}
                    onValueChange={(value) => setValue('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue className='mb-2' placeholder='Chọn giới tính' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>Nam</SelectItem>
                      <SelectItem value='female'>Nữ</SelectItem>
                      <SelectItem value='other'>Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label >Ngày sinh</Label>
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
                        captionLayout='dropdown'
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                        toDate={subDays(new Date(), 1)}
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

                <div className='flex gap-4'>
                  <Button type='submit' disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      reset(userData || {}); 
                      setIsEditing(false);
                    }}
                  >
                    Huỷ
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProfilePage;
