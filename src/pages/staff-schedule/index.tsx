import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Types
interface WorkSchedule {
  workScheduleId: number;
  title: string;
  description?: string;
  startTime?: string; 
  endTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserWorkSchedule {
  userWorkScheduleId: number;
  userId?: number;
  workScheduleId?: number;
  date?: Date;
  user?: {
    id: number;
    fullName: string;
    position?: string;
    avatarUrl?: string;
  };
}

export default function StaffSchedulePage() {
  const { showToast } = useToast();
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [userSchedules, setUserSchedules] = useState<UserWorkSchedule[]>([]);

  // Mock data - Thay bằng API call thực tế
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Giả lập API call
        const mockSchedules: WorkSchedule[] = [
          {
            workScheduleId: 1,
            title: 'Lịch làm việc tháng 6',
            startTime: '08:00:00',
            endTime: '17:00:00',
            createdAt: new Date(),
          },
        ];

        const mockUserSchedules: UserWorkSchedule[] = [
          {
            userWorkScheduleId: 1,
            workScheduleId: 1,
            date: new Date(),
            user: {
              id: 1,
              fullName: 'Nguyễn Văn A',
              position: 'Frontend Developer',
            },
          },
        ];

        setSchedules(mockSchedules);
        setUserSchedules(mockUserSchedules);
      } catch (error) {
        showToast('Lỗi tải dữ liệu', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectSchedule = (id: number) => {
    setSelectedSchedule(id);
    // TODO: Gọi API lấy danh sách user theo scheduleId
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar - 1/4 width */}
      <div className="w-1/4 border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Lịch làm việc</h2>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Lịch chung</TabsTrigger>
            <TabsTrigger value="personal">Cá nhân</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <ScrollArea className="h-[600px] pr-4">
              {schedules.map((schedule) => (
                <Card
                  key={schedule.workScheduleId}
                  className={`mb-3 cursor-pointer transition-colors ${
                    selectedSchedule === schedule.workScheduleId
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSelectSchedule(schedule.workScheduleId)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{schedule.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <span>{formatTime(schedule.startTime)}</span>
                      <span>-</span>
                      <span>{formatTime(schedule.endTime)}</span>
                    </div>
                    {schedule.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tạo ngày: {format(new Date(schedule.createdAt), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main content - 3/4 width */}
      <div className="w-3/4 p-6">
        {selectedSchedule ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {schedules.find(s => s.workScheduleId === selectedSchedule)?.title}
              </h2>
              <Button variant="outline">Xuất Excel</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSchedules
                .filter(us => us.workScheduleId === selectedSchedule)
                .map((userSchedule) => (
                  <Card key={userSchedule.userWorkScheduleId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center space-x-4">
                      {userSchedule.user?.avatarUrl ? (
                        <img
                          src={userSchedule.user.avatarUrl}
                          alt={userSchedule.user.fullName}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {userSchedule.user?.fullName.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{userSchedule.user?.fullName || 'Không xác định'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {userSchedule.user?.position || 'Chưa cập nhật'}
                        </p>
                        {userSchedule.date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Ngày: {format(new Date(userSchedule.date), 'dd/MM/yyyy', { locale: vi })}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg">Vui lòng chọn lịch từ danh sách bên trái</p>
          </div>
        )}
      </div>
    </div>
  );
}