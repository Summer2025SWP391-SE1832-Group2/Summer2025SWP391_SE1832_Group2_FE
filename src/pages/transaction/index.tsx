import { EmptyState } from '@/components/common/empty_state';
import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { DataTable } from '@/components/common/table/data_table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import {
  TransactionStats,
  TransactionHeader,
  createTransactionTableColumns,
} from '@/feature/transaction';
import { useTransaction } from '@/hooks/useTransaction';
import { useAuthStore } from '@/stores/auth';
import { CreditCard } from 'lucide-react';

export const TransactionPage = () => {
  const { user } = useAuthStore();
  const { queryTransactions } = useTransaction(user?.userId);
  const { data: transactions, isLoading, error, refetch } = queryTransactions;
  const { showToast } = useToast();

  // Handle copy transaction code
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast('Đã sao chép mã giao dịch', 'success');
    } catch (error) {
      showToast('Không thể sao chép mã giao dịch', 'error');
    }
  };

  // Handle open payment URL
  const handleOpenPaymentUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Table columns
  const columns = createTransactionTableColumns(handleCopyCode, handleOpenPaymentUrl);

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8'>
        <div className='container mx-auto px-4'>
          <ErrorMessage message='Không thể tải lịch sử giao dịch' onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'>
      <div className='container mx-auto px-4 py-8 space-y-8'>
        <TransactionHeader onRefresh={refetch} />

        {transactions?.length ? (
          <>
            <TransactionStats transactions={transactions} />

            {/* Transaction Table */}
            <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl'>
              <CardHeader className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg'>
                    <CreditCard className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <CardTitle className='text-xl text-slate-800'>Chi tiết giao dịch</CardTitle>
                    <CardDescription className='text-slate-600'>
                      Thông tin chi tiết về {transactions.length} giao dịch thanh toán của bạn
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='rounded-lg overflow-hidden border border-slate-200'>
                  <DataTable columns={columns} data={transactions} />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className='py-12'>
            <EmptyState
              title='Chưa có giao dịch nào'
              description='Bạn chưa có giao dịch thanh toán nào. Hãy thực hiện đặt lịch dịch vụ để bắt đầu!'
              actionLabel='Làm mới'
              onAction={refetch}
            />
          </div>
        )}
      </div>
    </div>
  );
};
