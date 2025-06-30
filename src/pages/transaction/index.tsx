import { EmptyState } from '@/components/common/empty_state';
import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { DataTable } from '@/components/common/table/data_table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { createTransactionTableColumns } from '@/feature/transaction';
import { useTransaction } from '@/hooks/useTransaction';
import { useAuthStore } from '@/stores/auth';
import { Receipt, RefreshCw, TrendingUp, DollarSign, CreditCard, Calendar } from 'lucide-react';
import { useMemo } from 'react';

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

  // Calculate transaction statistics
  const transactionStats = useMemo(() => {
    if (!transactions) return null;

    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter((t) => t.status === 'SUCCESS').length;
    const pendingTransactions = transactions.filter(
      (t) => t.status === 'PENDING' || 'Đang chờ',
    ).length;
    const totalAmount = transactions
      .filter((t) => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.price, 0);

    return {
      total: totalTransactions,
      successful: successfulTransactions,
      pending: pendingTransactions,
      totalAmount,
    };
  }, [transactions]);

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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* Header Section */}
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4'>
            <Receipt className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Lịch sử giao dịch
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Theo dõi và quản lý tất cả các giao dịch thanh toán của bạn một cách dễ dàng
          </p>
          <Button
            onClick={() => refetch()}
            variant='outline'
            size='lg'
            className='mt-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Làm mới dữ liệu
          </Button>
        </div>

        {/* Statistics Cards */}
        {transactionStats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600'>Tổng giao dịch</CardTitle>
                <div className='p-2 bg-blue-100 rounded-full'>
                  <Receipt className='h-4 w-4 text-blue-600' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-slate-800'>{transactionStats.total}</div>
                <p className='text-xs text-slate-500 mt-1'>Tất cả giao dịch của bạn</p>
              </CardContent>
            </Card>

            <Card className='bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600'>Thành công</CardTitle>
                <div className='p-2 bg-green-100 rounded-full'>
                  <TrendingUp className='h-4 w-4 text-green-600' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-green-600'>
                  {transactionStats.successful}
                </div>
                <p className='text-xs text-slate-500 mt-1'>Giao dịch hoàn thành</p>
              </CardContent>
            </Card>

            <Card className='bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600'>Đang xử lý</CardTitle>
                <div className='p-2 bg-yellow-100 rounded-full'>
                  <Calendar className='h-4 w-4 text-yellow-600' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-yellow-600'>{transactionStats.pending}</div>
                <p className='text-xs text-slate-500 mt-1'>Giao dịch chờ xử lý</p>
              </CardContent>
            </Card>

            <Card className='bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600'>
                  Tổng thanh toán
                </CardTitle>
                <div className='p-2 bg-purple-100 rounded-full'>
                  <DollarSign className='h-4 w-4 text-purple-600' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-purple-600'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    notation: 'compact',
                    maximumFractionDigits: 0,
                  }).format(transactionStats.totalAmount)}
                </div>
                <p className='text-xs text-slate-500 mt-1'>Tổng số tiền đã thanh toán</p>
              </CardContent>
            </Card>
          </div>
        )}

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
                  Thông tin chi tiết về các giao dịch thanh toán của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-6'>
            {!transactions?.length ? (
              <div className='py-12'>
                <EmptyState
                  title='Chưa có giao dịch nào'
                  description='Bạn chưa có giao dịch thanh toán nào. Hãy thực hiện đặt lịch dịch vụ để bắt đầu!'
                  actionLabel='Làm mới'
                  onAction={refetch}
                />
              </div>
            ) : (
              <div className='rounded-lg overflow-hidden border border-slate-200'>
                <DataTable columns={columns} data={transactions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-lg text-slate-800 flex items-center gap-2'>
                <Receipt className='h-5 w-5 text-blue-600' />
                Thông tin hữu ích
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm text-slate-600'>
              <p>• Bạn có thể sao chép mã giao dịch bằng cách nhấp vào biểu tượng copy</p>
              <p>• Giao dịch có trạng thái "Thành công" đã được xử lý hoàn tất</p>
              <p>• Liên hệ hỗ trợ nếu có giao dịch bất thường</p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-lg text-slate-800 flex items-center gap-2'>
                <CreditCard className='h-5 w-5 text-purple-600' />
                Hỗ trợ thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm text-slate-600'>
              <p>• Hotline: 1900 599 927 (24/7)</p>
              <p>• Email: support@bloodline-dna.com</p>
              <p>• Thời gian xử lý: 1-3 phút</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
