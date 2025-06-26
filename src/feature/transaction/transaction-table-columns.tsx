import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types/transaction';
import type { ColumnDef, Row } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Copy,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { TransactionStatusBadge } from './transaction-status-badge';

type TransactionTableActionsProps = {
  record: Transaction;
  onCopyCode: (code: string) => void;
  onOpenPaymentUrl: (url: string) => void;
};

const TransactionTableActions = ({
  record,
  onCopyCode,
  onOpenPaymentUrl,
}: TransactionTableActionsProps) => (
  <div className='flex justify-start gap-2'>
    <Button
      variant='ghost'
      size='sm'
      onClick={() => onCopyCode(record.transactionCode)}
      title='Sao chép mã giao dịch'
      className='h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors'
    >
      <Copy className='h-4 w-4' />
    </Button>
    {record.paymentUrl && (
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onOpenPaymentUrl(record.paymentUrl)}
        title='Mở link thanh toán'
        className='h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600 transition-colors'
      >
        <ExternalLink className='h-4 w-4' />
      </Button>
    )}
  </div>
);

export const createTransactionTableColumns = (
  onCopyCode: (code: string) => void,
  onOpenPaymentUrl: (url: string) => void,
): ColumnDef<Transaction>[] => [
  {
    header: 'Mã giao dịch',
    accessorKey: 'transactionCode',
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='font-mono text-sm bg-slate-50 px-2 py-1 rounded border border-slate-200'>
        {row.original.transactionCode}
      </div>
    ),
  },
  {
    header: 'Mã đơn hàng',
    accessorKey: 'orderCode',
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='font-mono text-sm text-slate-600'>{row.original.orderCode}</div>
    ),
  },
  {
    header: 'Mô tả',
    accessorKey: 'description',
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='max-w-xs truncate text-slate-700' title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-semibold hover:bg-transparent'
        >
          Số tiền
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='font-semibold text-slate-800 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-lg border border-blue-200'>
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(row.original.price)}
      </div>
    ),
  },
  {
    accessorKey: 'paymentGateway',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-semibold hover:bg-transparent'
        >
          Cổng thanh toán
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='flex items-center gap-2'>
        <CreditCard className='h-4 w-4 text-blue-600' />
        <span className='text-sm font-medium text-slate-700'>{row.original.paymentGateway}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-semibold hover:bg-transparent'
        >
          Trạng thái
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='flex justify-start'>
        <TransactionStatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-2'
        >
          <Calendar className='h-4 w-4' />
          Ngày tạo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='flex items-center gap-2 text-sm text-slate-600'>
        <Calendar className='h-4 w-4 text-slate-400' />
        <span>{new Date(row.original.createdAt).toLocaleString('vi-VN')}</span>
      </div>
    ),
  },
  {
    header: 'Thao tác',
    cell: ({ row }: { row: Row<Transaction> }) => (
      <TransactionTableActions
        record={row.original}
        onCopyCode={onCopyCode}
        onOpenPaymentUrl={onOpenPaymentUrl}
      />
    ),
  },
];
