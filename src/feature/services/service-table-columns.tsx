import { Button } from '@/components/ui/button';
import type { ServiceResponse } from '@/types/services';
import type { Row } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { ServiceStatusBadge } from './service-status-badge';

type ServiceTableActionsProps = {
  record: ServiceResponse;
  onEdit: (record: ServiceResponse) => void;
  onDelete: (record: ServiceResponse) => void;
};

const ServiceTableActions = ({ record, onEdit, onDelete }: ServiceTableActionsProps) => (
  <div className='flex justify-start gap-2'>
    <Button variant='ghost' size='icon' onClick={() => onEdit(record)}>
      <Edit className='h-4 w-4' />
    </Button>
    <Button
      variant='ghost'
      size='icon'
      onClick={() => onDelete(record)}
      className='text-red-600 hover:text-red-700 hover:bg-red-50'
    >
      <Trash2 className='h-4 w-4' />
    </Button>
  </div>
);

export const createServiceTableColumns = (
  onEdit: (record: ServiceResponse) => void,
  onDelete: (record: ServiceResponse) => void,
) => [
  {
    header: 'Tên dịch vụ',
    accessorKey: 'name',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <div className='font-medium'>{row.original.name}</div>
    ),
  },
  {
    header: 'Mô tả',
    accessorKey: 'description',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <div className='max-w-xs truncate' title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    header: 'Thời gian (Ngày)',
    accessorKey: 'durationDays',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <div className='text-center'>{row.original.durationDays}</div>
    ),
  },
  {
    header: 'Giá',
    accessorKey: 'price',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <div className='font-medium'>
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(row.original.price)}
      </div>
    ),
  },
  {
    header: 'Tại nhà',
    accessorKey: 'isAtHome',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <div className='text-left'>
        <ServiceStatusBadge isActive={row.original.isAtHome} />
      </div>
    ),
  },
  {
    header: 'Hỗ trợ nhân viên',
    accessorKey: 'isStaffSuport',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <div>
        <ServiceStatusBadge isActive={row.original.isStaffSuport} />
      </div>
    ),
  },
  {
    header: 'Thao tác',
    cell: ({ row }: { row: Row<ServiceResponse> }) => (
      <ServiceTableActions record={row.original} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
