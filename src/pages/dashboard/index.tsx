import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, TestTube, Users } from 'lucide-react';

const stats = [
  {
    title: 'Tổng xét nghiệm',
    value: '2,420',
    icon: <TestTube className='h-6 w-6' />,
    description: 'Tháng này +180',
  },
  {
    title: 'Lịch hẹn hôm nay',
    value: '12',
    icon: <Calendar className='h-6 w-6' />,
    description: '4 chưa xác nhận',
  },
  {
    title: 'Khách hàng mới',
    value: '573',
    icon: <Users className='h-6 w-6' />,
    description: 'Tháng này +48',
  },
  {
    title: 'Tỷ lệ hoàn thành',
    value: '98.5%',
    icon: <Activity className='h-6 w-6' />,
    description: '+2.1% so với tháng trước',
  },
];

const DashboardPage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Tổng quan</h2>
        <p className='text-muted-foreground'>Xem tổng quan về hoạt động và thống kê của hệ thống</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-muted-foreground'>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add recent appointments list here */}
            <div className='text-sm text-muted-foreground'>Chưa có lịch hẹn nào</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xét nghiệm đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add in-progress tests list here */}
            <div className='text-sm text-muted-foreground'>Chưa có xét nghiệm nào đang xử lý</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
