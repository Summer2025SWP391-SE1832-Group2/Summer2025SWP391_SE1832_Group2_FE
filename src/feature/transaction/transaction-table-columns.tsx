import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types/transaction';
import type { Row } from '@tanstack/react-table';
import { ExternalLink, Copy, Calendar, CreditCard } from 'lucide-react';
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
) => [
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
    header: 'Số tiền',
    accessorKey: 'price',
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
    header: 'Cổng thanh toán',
    accessorKey: 'paymentGateway',
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='flex items-center gap-2'>
        <CreditCard className='h-4 w-4 text-blue-600' />
        <span className='text-sm font-medium text-slate-700'>{row.original.paymentGateway}</span>
      </div>
    ),
  },
  {
    header: 'Trạng thái',
    accessorKey: 'status',
    cell: ({ row }: { row: Row<Transaction> }) => (
      <div className='flex justify-center'>
        <TransactionStatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    header: 'Ngày tạo',
    accessorKey: 'createdAt',
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
