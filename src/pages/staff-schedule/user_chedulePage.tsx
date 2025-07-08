import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { CalendarEvent } from '@/types/calendar';
import type { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  createUserWorkSchedule,
  getUserWorkScheduleUserById,
} from '@/services/userworkschedule_service';
import type { WorkSchedule } from '@/types/workschedule';
import { getAllWorkSchedules } from '@/services/schedule_service';
import { deleteUserWorkSchedule } from '@/services/userworkschedule_service';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: vi }),
  getDay,
  locales: { vi },
});

interface LocationState {
  user: User;
  events: CalendarEvent[];
}

export default function UserSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventList, setEventList] = useState<CalendarEvent[]>(state?.events || []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!state?.user || !state?.events) {
    return (
      <div className='p-4'>
        <p className='text-red-600'>Không có dữ liệu lịch làm việc.</p>
        <button
          onClick={() => navigate(-1)}
          className='mt-2 px-4 py-2 bg-indigo-600 text-white rounded'
        >
          Quay lại
        </button>
      </div>
    );
  }

  const handleAddEvent = async () => {
    if (!selectedDate || selectedSlot === null) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset về 00:00

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected <= today) {
      alert('Không thể thêm lịch làm việc cho hôm nay hoặc các ngày trong quá khứ!');
      return;
    }
    const slot = workSchedules.find((s) => s.workScheduleId === selectedSlot);
    if (!slot) return;

    const isDuplicate = eventList.some(
      (event) =>
        event.start.toDateString() === selectedDate.toDateString() &&
        event.workScheduleId === selectedSlot,
    );

    if (isDuplicate) {
      alert('Đã có lịch làm việc trùng trong ngày này!');
      return;
    }

    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0);

    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0);

    try {
      console.log('Thêm lịch làm việc:', selectedDate);
      const newSchedule = await createUserWorkSchedule({
        userId: state.user.userId,
        workScheduleId: slot.workScheduleId,
        date: selectedDate.toLocaleDateString('en-CA'),
      });

      const newEvent: CalendarEvent = {
        title: slot.title,
        start,
        end,
        allDay: false,
        userWorkScheduleId: newSchedule.userWorkScheduleId,
        workScheduleId: slot.workScheduleId,
      };

      setEventList([...eventList, newEvent]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Lỗi khi tạo lịch:', error);
    }
  };

  const handleDeleteEventConfirmed = async () => {
    if (!eventToDelete) return;

    if (!eventToDelete.userWorkScheduleId) {
      setEventList(eventList.filter((event) => event !== eventToDelete));
      setDeleteDialogOpen(false);
      return;
    }

    try {
      await deleteUserWorkSchedule(eventToDelete.userWorkScheduleId);
      setEventList(eventList.filter((event) => event !== eventToDelete));
    } catch (error) {
      console.error('Lỗi khi xoá lịch làm việc:', error);
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  useEffect(() => {
    const fetchWorkSchedules = async () => {
      try {
        const data = await getAllWorkSchedules();
        const schedule = await getUserWorkScheduleUserById(state.user.userId);
        const mapped: CalendarEvent[] = schedule.map((s: any) => {
          const date = new Date(s.date);
          return {
            title: s.title || 'Ca làm',
            start: date,
            end: date,
            allDay: true,
            color: '#22C55E',
            userWorkScheduleId: s.userWorkScheduleId,
            workScheduleId: s.workScheduleId,
          };
        });
        setEventList(mapped);
        setWorkSchedules(data);
      } catch (err) {
        console.error('Lỗi khi lấy work schedules:', err);
      }
    };
    fetchWorkSchedules();
  }, []);

  return (
    <div className='w-full h-screen p-4 bg-white'>
      <h1 className='text-xl font-bold mb-4'>Lịch làm việc: {state.user.fullName}</h1>
      <div className='h-[calc(100vh-100px)]'>
        <Calendar
          showAllEvents={true}
          localizer={localizer}
          events={[...eventList].sort((a, b) => {
            const slotA = workSchedules.find((ws) => ws.workScheduleId === a.workScheduleId);
            const slotB = workSchedules.find((ws) => ws.workScheduleId === b.workScheduleId);

            if (!slotA || !slotB) return 0;

            const [aHour, aMinute] = slotA.startTime.split(':').map(Number);
            const [bHour, bMinute] = slotB.startTime.split(':').map(Number);

            return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
          })}
          startAccessor='start'
          endAccessor='end'
          views={['month']}
          defaultView='month'
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          selectable={true}
          onSelectSlot={(slotInfo) => {
            setSelectedDate(slotInfo.start);
            setOpenDialog(true);
          }}
          onSelectEvent={(event) => {
            setEventToDelete(event);
            setDeleteDialogOpen(true);
          }}
          popup={true}
          style={{ height: '100%' }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#4f46e5',
              color: 'white',
              borderRadius: '4px',
              padding: '2px',
              fontSize: '12px',
              overflowWrap: 'break-word',
            },
          })}
          components={{
            month: {
              event: ({ event }: any) => (
                <div
                  className='flex justify-between items-center gap-1 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    setEventToDelete(event);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <span>{event.title}</span>
                </div>
              ),
            },
          }}
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm lịch làm việc</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>Ngày: {selectedDate?.toLocaleDateString('vi-VN')}</p>
            <Select onValueChange={(value) => setSelectedSlot(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn khung giờ' />
              </SelectTrigger>
              <SelectContent>
                {workSchedules.map((slot) => (
                  <SelectItem key={slot.workScheduleId} value={String(slot.workScheduleId)}>
                    {slot.title} ({slot.startTime} - {slot.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex justify-end'>
              <Button onClick={handleAddEvent}>Thêm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá lịch làm việc</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>
              Bạn có chắc muốn xoá ca <strong>{eventToDelete?.title}</strong> vào ngày{' '}
              <strong>{eventToDelete?.start.toLocaleDateString('vi-VN')}</strong> không?
            </p>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                Huỷ
              </Button>
              <Button variant='destructive' onClick={handleDeleteEventConfirmed}>
                Xoá
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
