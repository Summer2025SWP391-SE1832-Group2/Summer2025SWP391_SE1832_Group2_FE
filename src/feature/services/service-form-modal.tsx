import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  serviceFormDefaultValues,
  serviceFormSchema,
  type ServiceFormValues,
} from '@/lib/zod/services';
import type { ServiceRequest, ServiceResponse } from '@/types/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type ServiceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  editingService: ServiceResponse | null;
  isProcessing: boolean;
};

export const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingService,
  isProcessing,
}: ServiceFormModalProps) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: serviceFormDefaultValues,
  });

  const handleSubmit = async (values: ServiceFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset(serviceFormDefaultValues);
    }
  }, [isOpen, form]);

  // Populate form when editing
  useEffect(() => {
    if (editingService) {
      form.reset({
        name: editingService.name,
        description: editingService.description,
        durationDays: editingService.durationDays,
        price: editingService.price,
        isAtHome: editingService.isAtHome,
        isStaffSuport: editingService.isStaffSuport,
      });
    }
  }, [editingService, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{editingService ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}</DialogTitle>
          <DialogDescription>
            {editingService
              ? 'Cập nhật thông tin dịch vụ bên dưới.'
              : 'Điền thông tin để tạo dịch vụ mới.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên dịch vụ</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên dịch vụ' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả dịch vụ' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='durationDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian (Ngày)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập số ngày'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập giá'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='isAtHome'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Dịch vụ tại nhà</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isStaffSuport'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Hỗ trợ nhân viên</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose} disabled={isProcessing}>
                Hủy
              </Button>
              <Button type='submit' disabled={isProcessing}>
                {isProcessing ? 'Đang lưu...' : editingService ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
