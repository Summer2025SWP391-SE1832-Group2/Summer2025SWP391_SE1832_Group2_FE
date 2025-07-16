import { EmptyState } from '@/components/common/empty_state';
import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { DataTable } from '@/components/common/table/data_table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  ServiceFormModal,
  ServiceDeleteModal,
  createServiceTableColumns,
} from '@/feature/services';
import { useService } from '@/hooks/useService';
import type { ServiceFormValues } from '@/lib/zod/services';
import type { ServiceRequest, ServiceResponse } from '@/types/services';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const ServicesPage = () => {
  // State management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceResponse | null>(null);

  // Hooks
  const { queryServices, createMutation, updateMutation, deleteMutation } = useService();
  const { data: services, isLoading, error, refetch } = queryServices;
  const { showToast } = useToast();

  // Event handlers
  const handleCreate = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record: ServiceResponse) => {
    setEditingService(record);
    setIsFormModalOpen(true);
  };

  const handleDelete = (record: ServiceResponse) => {
    setDeletingService(record);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (values: ServiceFormValues) => {
    try {
      const serviceData: ServiceRequest = {
        ...values,
        serviceId: editingService?.serviceId,
      };

      if (editingService) {
        await updateMutation.mutateAsync(serviceData);
        showToast('Cập nhật dịch vụ thành công', 'success');
      } else {
        await createMutation.mutateAsync(serviceData);
        showToast('Tạo dịch vụ thành công', 'success');
      }

      setIsFormModalOpen(false);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Có lỗi xảy ra khi lưu dịch vụ', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;

    try {
      await deleteMutation.mutateAsync(Number(deletingService.serviceId));
      showToast('Xóa dịch vụ thành công', 'success');
      setIsDeleteModalOpen(false);
      setDeletingService(null);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa dịch vụ', 'error');
    }
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingService(null);
  };

  // Table columns configuration
  const columns = createServiceTableColumns(handleEdit, handleDelete);

  // Loading and error states
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message='Không thể tải danh sách dịch vụ' onRetry={refetch} />;

  const isProcessing = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Quản lý dịch vụ</h1>
          <p className='text-muted-foreground'>Quản lý các dịch vụ xét nghiệm DNA</p>
        </div>
        <Button onClick={handleCreate} className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Thêm dịch vụ
        </Button>
      </div>

      {/* Content */}
      {!services?.length ? (
        <EmptyState
          title='Chưa có dịch vụ nào'
          description='Tạo dịch vụ đầu tiên để bắt đầu'
          actionLabel='Thêm dịch vụ'
          onAction={handleCreate}
        />
      ) : (
        <div className='rounded-md border'>
          <DataTable columns={columns} data={services} />
        </div>
      )}

      {/* Form Modal */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        onSubmit={handleFormSubmit}
        editingService={editingService}
        isProcessing={isProcessing}
      />

      {/* Delete Confirmation Modal */}
      <ServiceDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        service={deletingService}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ServicesPage;
