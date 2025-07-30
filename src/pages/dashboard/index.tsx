import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, TestTube, Users } from 'lucide-react';
import { getDashboardInfo } from '@/services/user_service';
import type { DashboardInfo } from '@/types/user';


const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardInfo();
        setDashboardData(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = dashboardData
    ? [
        {
          title: 'Tổng xét nghiệm',
          value: dashboardData.totalBookings.toLocaleString(),
          icon: <TestTube className="h-6 w-6" />,
          description: `Hoàn thành: ${dashboardData.totalBookingsCompleted}`,
        },
        {
          title: 'Lịch hẹn hôm nay',
          value: dashboardData.totalBookingsToday.toString(),
          icon: <Calendar className="h-6 w-6" />,
          description: 'Hôm nay',
        },
        {
          title: 'Khách hàng',
          value: dashboardData.totalUsers.toLocaleString(),
          icon: <Users className="h-6 w-6" />,
          description: 'Tổng số khách hàng',
        },
        {
          title: 'Tỷ lệ hoàn thành',
          value:
            dashboardData.totalBookings > 0
              ? ((dashboardData.totalBookingsCompleted / dashboardData.totalBookings) * 100).toFixed(1) + '%'
              : '0%',
          icon: <Activity className="h-6 w-6" />,
          description: 'So với tổng số xét nghiệm',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">Xem tổng quan về hoạt động và thống kê của hệ thống</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
