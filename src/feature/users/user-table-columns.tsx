import { type User } from '@/types/user';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { UserRoleDropdown } from './user-role-dropdown';

export const createUserTableColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: 'userId',
    header: 'ID',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('userId')}</div>,
  },
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
    cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    cell: ({ row }) => <UserRoleDropdown user={row.original} />,
  },
  {
    accessorKey: 'gender',
    header: 'Giới tính',
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string;
      const displayGender =
        {
          male: 'Nam',
          female: 'Nữ',
          other: 'Khác',
        }[gender] || gender;
      return <div>{displayGender}</div>;
    },
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Ngày sinh',
    cell: ({ row }) => {
      const date = new Date(row.getValue('dateOfBirth'));
      return <div>{format(date, 'dd/MM/yyyy')}</div>;
    },
  },
];
