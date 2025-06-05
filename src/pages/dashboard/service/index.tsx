import { EmptyState } from '@/components/common/empty_state';
import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { DataTable } from '@/components/common/table/data_table';
import { Button } from '@/components/ui/button';
import { useService } from '@/hooks/useService';
import type { ServiceResponse } from '@/types/services';
import type { Row } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const { queryServices } = useService();
  const { data: services, isLoading, error } = queryServices;
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<ServiceResponse> }) => {
        const record = row.original;
        return (
          <div className='flex justify-end'>
            <Button variant='ghost' size='icon' onClick={() => handleEdit(record)}>
              <Pencil className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  isModalOpen && editingService;

  const handleEdit = (record: ServiceResponse) => {
    setEditingService(record);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message='Failed to load service types' />;
  if (!services?.length)
    return (
      <EmptyState
        title='No service types found'
        description='Click the Add Service Type button to create one'
      />
    );

  return (
    <div className='p-6'>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Service Types</h1>
        <Button onClick={handleOpenModal}>Add Service Type</Button>
      </div>

      <div className='rounded-md border'>
        <DataTable columns={columns} data={services} />
      </div>
    </div>
  );
};

export default ServicesPage;
