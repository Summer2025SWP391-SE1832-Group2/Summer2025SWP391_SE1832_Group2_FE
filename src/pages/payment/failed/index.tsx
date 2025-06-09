import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { paths } from '@/utils/constant/path';
import { AlertTriangle, ArrowLeft, ChevronRight, FileText, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const [errorDetails] = useState({
    orderNumber: searchParams.get('orderNumber') || '0000000',
    serviceName: searchParams.get('serviceName') || 'DNA Testing Service',
    amount: searchParams.get('amount') || '1,000,000 VND',
    errorCode: searchParams.get('errorCode') || 'ERR-5001',
    errorMessage: searchParams.get('errorMessage') || 'Giao dịch không thành công',
    date: new Date().toLocaleString('vi-VN'),
  });

  return (
    <div className='container max-w-6xl mx-auto py-16 px-4 sm:px-6 flex flex-col items-center'>
      {/* Error Message */}
      <div className='text-center mb-12'>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6'>
          <AlertTriangle className='w-12 h-12 text-red-600' />
        </div>
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>Thanh toán không thành công</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Rất tiếc, chúng tôi không thể xử lý thanh toán của bạn. Vui lòng kiểm tra thông tin thanh
          toán và thử lại.
        </p>
      </div>

      {/* Error Details Card */}
      <Card className='w-full max-w-2xl mb-12 overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800'>
        <div className='bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-border/30'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <FileText className='h-5 w-5 text-red-600 dark:text-red-400' />
              <h2 className='text-lg font-medium'>Chi tiết lỗi</h2>
            </div>
            <span className='text-sm text-muted-foreground'>{errorDetails.date}</span>
          </div>
        </div>

        <CardContent className='p-6'>
          <div className='space-y-4'>
            <div className='flex justify-between py-2 border-b border-border/30'>
              <span className='text-muted-foreground'>Dịch vụ:</span>
              <span className='font-medium'>{errorDetails.serviceName}</span>
            </div>

            <div className='flex justify-between py-2 border-b border-border/30'>
              <span className='text-muted-foreground'>Mã đơn hàng:</span>
              <span className='font-medium'>#{errorDetails.orderNumber}</span>
            </div>

            <div className='flex justify-between py-2 border-b border-border/30'>
              <span className='text-muted-foreground'>Tổng thanh toán:</span>
              <span className='font-medium'>{errorDetails.amount}</span>
            </div>

            <div className='py-3 px-4 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-800'>
              <div className='flex items-start'>
                <AlertTriangle className='h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0' />
                <div>
                  <p className='font-medium text-red-700 dark:text-red-400'>
                    {errorDetails.errorCode}: {errorDetails.errorMessage}
                  </p>
                  <p className='text-sm text-red-600/80 dark:text-red-300/80 mt-1'>
                    Vui lòng kiểm tra lại thông tin thanh toán của bạn hoặc liên hệ hỗ trợ nếu vấn
                    đề vẫn tiếp tục.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl'>
        <Button asChild variant='outline' size='lg' className='w-full sm:w-auto'>
          <Link to={paths.home} className='flex items-center justify-center gap-2'>
            <ArrowLeft className='w-4 h-4' />
            <span>Về trang chủ</span>
          </Link>
        </Button>

        <Button
          asChild
          size='lg'
          className='w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
        >
          <Link to='/support' className='flex items-center justify-center gap-2'>
            <HelpCircle className='w-4 h-4' />
            <span>Liên hệ hỗ trợ</span>
            <ChevronRight className='w-4 h-4 ml-1' />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
