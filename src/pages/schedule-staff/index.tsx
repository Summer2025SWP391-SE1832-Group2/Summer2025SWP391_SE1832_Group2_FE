import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { CalendarEvent } from '@/types/calendar';
import type { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { getUserWorkScheduleUserById } from '@/services/userworkschedule_service';
import type { WorkSchedule } from '@/types/workschedule';
import { getAllWorkSchedules } from '@/services/schedule_service';
import { useAuthStore } from '@/stores/auth';

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

export default function StaffIndividualSchedulePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventList, setEventList] = useState<CalendarEvent[]>(state?.events || []);
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);

  //   if (!state?.user || !state?.events) {
  //     return (
  //       <div className='p-4'>
  //         <p className='text-red-600'>Không có dữ liệu lịch làm việc.</p>
  //         <button
  //           onClick={() => navigate(-1)}
  //           className='mt-2 px-4 py-2 bg-indigo-600 text-white rounded'
  //         >
  //           Quay lại
  //         </button>
  //       </div>
  //     );
  //   }

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      try {
        const [slots, schedule] = await Promise.all([
          getAllWorkSchedules(),
          getUserWorkScheduleUserById(user.userId),
        ]);

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

        setWorkSchedules(slots);
        setEventList(mapped);
      } catch (err) {
        console.error('Lỗi khi lấy work schedules:', err);
      }
    };

    fetchData();
  }, [user]);
  if (!user?.userId)
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

  return (
    <div className='w-full h-screen p-4 bg-white'>
      <h1 className='text-xl font-bold mb-4'>Lịch làm việc: {user.fullName}</h1>
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
                  }}
                >
                  <span>{event.title}</span>
                </div>
              ),
            },
          }}
        />
      </div>
    </div>
  );
}
