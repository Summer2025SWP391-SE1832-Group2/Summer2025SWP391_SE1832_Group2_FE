import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Summary {
  totalRevenue: number;
  totalRefund: number;
  totalTransaction: number;
  refundRate: number;
}

export default function DashboardOverview() {
  const summary: Summary = {
    totalRevenue: 2000000,
    totalRefund: 1500000,
    totalTransaction: 2,
    refundRate: 0.5,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader><CardTitle>Doanh thu</CardTitle></CardHeader>
        <CardContent><p className="text-xl font-bold text-green-600">{summary.totalRevenue.toLocaleString()}đ</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Đã hoàn</CardTitle></CardHeader>
        <CardContent><p className="text-xl font-bold text-red-500">{summary.totalRefund.toLocaleString()}đ</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Giao dịch</CardTitle></CardHeader>
        <CardContent><p className="text-xl font-bold">{summary.totalTransaction}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Tỷ lệ hoàn</CardTitle></CardHeader>
        <CardContent><p className="text-xl font-bold">{(summary.refundRate * 100).toFixed(0)}%</p></CardContent>
      </Card>
    </div>
  );
}