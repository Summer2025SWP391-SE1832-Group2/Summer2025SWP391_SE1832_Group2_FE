import { EmptyState } from '@/components/common/empty_state';
import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { DataTable } from '@/components/common/table/data_table';
import { createUserTableColumns } from '@/feature/users';
import { useUser } from '@/hooks/useUser';

const UsersPage = () => {
  const { queryUsersByRole } = useUser();
  const { data: users, isLoading, error, refetch } = queryUsersByRole;

  // Table columns configuration
  const columns = createUserTableColumns();

  // Loading and error states
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message='Không thể tải danh sách người dùng' onRetry={refetch} />;

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý người dùng</h1>
        <p className='text-muted-foreground'>Danh sách nhân viên trong hệ thống</p>
      </div>

      {/* Content */}
      {!users?.length ? (
        <EmptyState
          title='Chưa có người dùng nào'
          description='Không tìm thấy người dùng nào trong hệ thống'
        />
      ) : (
        <div className='rounded-md border'>
          <DataTable columns={columns} data={users} />
        </div>
      )}
    </div>
  );
};

export default UsersPage;
