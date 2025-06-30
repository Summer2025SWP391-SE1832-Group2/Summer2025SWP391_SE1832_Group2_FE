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
import { createUserWorkSchedule, getUserWorkScheduleUserById } from '@/services/userworkschedule_service';
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

    const slot = workSchedules.find((s) => s.workScheduleId === selectedSlot);
    if (!slot) return;

    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const start = new Date(selectedDate);
    // start.setHours(startHour, startMinute, 0);

    const end = new Date(selectedDate);
    // end.setHours(endHour, endMinute, 0);

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
      // 
      
    } catch (error) {
      console.error('Lỗi khi tạo lịch:', error);
    }
  };

  const handleDeleteEvent = async (eventToDelete: CalendarEvent) => {
    
    if (!eventToDelete.userWorkScheduleId) {
        console.log('Không có userWorkScheduleId để xoá:', eventToDelete.userWorkScheduleId);
      setEventList(eventList.filter((event) => event !== eventToDelete));
      return;
    }
  
    try {
      await deleteUserWorkSchedule(eventToDelete.userWorkScheduleId);
      setEventList(eventList.filter((event) => event !== eventToDelete));
    } catch (error) {
      console.error('Lỗi khi xoá lịch làm việc:', error);
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
          events={eventList}
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
            if (window.confirm(`Xoá sự kiện "${event.title}"?`)) {
              handleDeleteEvent(event);
            }
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
                <div className='flex justify-between items-center gap-1'>
                  <span>{event.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event);
                    }}
                    className='text-red-500 ml-2 hover:text-red-700'
                    title='Xoá slot'
                  >
                    xóa
                  </button>
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
    </div>
  );
}
