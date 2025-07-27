import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { chartData } from '@/services/transaction';
import type { TransactionChartData } from '@/types/transaction';

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: '#2563eb',
  },
} satisfies ChartConfig;
type Period = 'week' | 'month' | 'year';

export default function ChartSection() {
  const [period, setPeriod] = useState<Period>('week');
  const [data, setData] = useState<TransactionChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        
        const result = await chartData(period);
        setData(result);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period]);

  const yTickFormatter = (value: number): string => `${value}VND`;

  return (
    <div className='border rounded-xl p-4'>
      <h3 className='text-lg font-semibold mb-4'>Biểu đồ doanh thu</h3>

      <div className='mb-4 flex gap-2'>
        {['week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p as Period)}
            className={`px-3 py-1 rounded ${
              period === p ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='text-gray-500'>Đang tải dữ liệu...</div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart data={data} width={600} height={300}>
            <XAxis dataKey='label' />
            <YAxis tickFormatter={yTickFormatter} />
            <Bar dataKey='total' fill='var(--color-revenue)' />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
