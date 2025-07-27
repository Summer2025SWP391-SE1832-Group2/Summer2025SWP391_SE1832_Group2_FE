import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { totalAmount } from '@/services/transaction';
import type { TransactionSummary } from '@/types/transaction';

export default function DashboardOverview() {
  const [summary, setSummary] = useState<TransactionSummary>();

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await totalAmount();
      setSummary(data);
    };
    fetchSummary();
  }, []);

  const totalTransaction = summary?.totalSuccessfulTransactions || 0;
  const refundRate =
    summary && summary.totalSuccessfulTransactions > 0
      ? summary.totalRefundedTransactions / summary.totalSuccessfulTransactions
      : 0;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl font-bold text-green-600'>
            {summary?.totalPaidAmount.toLocaleString()}đ
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Đã hoàn</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl font-bold text-red-500'>
            {summary?.totalRefundedAmount.toLocaleString()}đ
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl font-bold'>{totalTransaction}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tỷ lệ hoàn</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-xl font-bold'>{(refundRate * 100).toFixed(0)}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
