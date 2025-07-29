import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllWorkSchedules, getUser_workScheduleBySlot } from '@/services/schedule_service';
import { translateRoleToVietnamese, type User } from '@/types/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import AddEmployeeDialog from './dialog-add-staff';

interface ScheduleEvent {
  title: string;
  start: Date;
  end: Date;
  slotId: number;
  participants: User[];
  color: string;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: vi }),
  getDay,
  locales: { vi },
});

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function ManagerSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllWorkSchedules();
      const events: ScheduleEvent[] = [];
      const ref = new Date();
      const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
      const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        data.forEach((slot, index) => {
          const startParts = slot.startTime.split(':');
          const endParts = slot.endTime.split(':');
          const startTime = new Date(d);
          const endTime = new Date(d);
          startTime.setHours(Number(startParts[0]), Number(startParts[1]));
          endTime.setHours(Number(endParts[0]), Number(endParts[1]));

          events.push({
            title: slot.title,
            start: new Date(startTime),
            end: new Date(endTime),
            slotId: slot.workScheduleId,
            participants: [],
            color: colors[index % colors.length],
          });
        });
      }
      setEvents(events);
    }
    fetchData();
  }, []);

  const handleSelectEvent = async (event: ScheduleEvent) => {
    const dateString = format(event.start, 'yyyy/MM/dd');
    setSelectedDate(event.start);
    setSelectedSlot(event.slotId);
    const users = await getUser_workScheduleBySlot(event.slotId, dateString);
    const filteredUsers = users.filter(
      (user) => user.role === 'HomeStaff' || user.role === 'FacilityStaff' 
    );
    setSelectedUsers(filteredUsers);
  };

  return (
    <div className='h-screen w-full flex flex-row'>
      {/* 2/3 trái: Calendar */}
      <div className='basis-2/3 border-r border-gray-200'>
        <style>{`
          .rbc-month-row { min-height: 130px; }
          .rbc-toolbar { display: none; }
        `}</style>
        <Calendar
          showAllEvents
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          views={[Views.MONTH]}
          defaultView={Views.MONTH}
          date={currentDate}
          onNavigate={setCurrentDate}
          popup={false}
          selectable
          dayLayoutAlgorithm='no-overlap'
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              color: 'white',
              borderRadius: '4px',
              padding: '1px 2px',
              fontSize: '11px',
              lineHeight: '14px',
              margin: '1px 0',
            },
          })}
          components={{
            month: {
              event: ({ event }: { event: ScheduleEvent }) => <span>{event.title}</span>,
            },
          }}
        />
      </div>

      {/* 1/3 phải: Danh sách nhân viên */}
      <div className='basis-1/3 overflow-y-auto p-4'>
        <Button
          onClick={() => {
            if (selectedSlot && selectedDate) {
              setOpenDialog(true);
            } else {
              alert('Vui lòng chọn một ca làm việc trước.');
            }
          }}
        >
          Thêm nhân viên
        </Button>
        <h2 className='font-semibold mb-2 text-lg'>
          Người trực slot {selectedSlot} ngày{' '}
          {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
        </h2>
        {selectedUsers && selectedUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Vai trò</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedUsers.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell>{u.userId}</TableCell>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{translateRoleToVietnamese(u.role)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className='text-gray-500'>
            {selectedUsers ? 'Chưa có người trực ca.' : 'Chọn 1 ca trong lịch để xem danh sách.'}
          </p>
        )}
      </div>
      <AddEmployeeDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
      />
    </div>
  );
}
