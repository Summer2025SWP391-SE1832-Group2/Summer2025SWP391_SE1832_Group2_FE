import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, add } from "date-fns";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface User {
  id: number;
  name: string;
}

interface SlotConfig {
  id: number;
  title: string;
  startOffsetH: number;
  endOffsetH: number;
}

const slots: SlotConfig[] = [
  { id: 1, title: "Sáng", startOffsetH: 8, endOffsetH: 12 },
  { id: 2, title: "Chiều", startOffsetH: 13, endOffsetH: 17 },
  { id: 3, title: "Tối", startOffsetH: 18, endOffsetH: 22 },
  { id: 4, title: "Đêm", startOffsetH: 23, endOffsetH: 24 },
];

const users: User[] = [
  { id: 1, name: "An" },
  { id: 2, name: "Bình" },
  { id: 3, name: "Châu" },
  { id: 4, name: "Dũng" },
];

function generateFakeEvents(start: Date): any[] {
  const events: any[] = [];
  for (let d = 0; d < 7; d++) {
    const day = add(start, { days: d });
    users.forEach((u) => {
      const randomSlots = [...slots].sort(() => 0.5 - Math.random()).slice(0, 2);
      randomSlots.forEach((slot) => {
        const startDate = new Date(day);
        startDate.setHours(slot.startOffsetH, 0, 0);
        const endDate = new Date(day);
        endDate.setHours(slot.endOffsetH, 0, 0);
        events.push({
          title: slot.title,
          start: startDate,
          end: endDate,
          allDay: false,
          slotId: slot.id,
          userId: u.id,
          userName: u.name,
        });
      });
    });
  }
  return events;
}

const locales = { vi };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { locale: vi }), getDay, locales });

export default function ManagerSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState(generateFakeEvents(startOfWeek(new Date())));
  const [selectedUsers, setSelectedUsers] = useState<User[] | null>(null);

  // Khi click vào 1 slot (event), lọc user list
  const handleSelectEvent = (event: any) => {
    const sameDaySlotUsers = events
      .filter(
        (e) =>
          e.slotId === event.slotId &&
          e.start.toDateString() === event.start.toDateString()
      )
      .map((e) => ({ id: e.userId, name: e.userName } as User));

    setSelectedUsers(sameDaySlotUsers);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="basis-2/3 border-b border-gray-200">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          defaultView="month"
          date={currentDate}
          onNavigate={setCurrentDate}
          popup
          selectable
          onSelectEvent={handleSelectEvent}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#4f46e5",
              color: "white",
              borderRadius: "4px",
              padding: "2px",
              fontSize: "12px",
            },
          })}
          components={{
            month: {
              event: ({ event }: any) => <span>{event.title}</span>,
            },
          }}
        />
      </div>

      <div className="basis-1/3 overflow-y-auto p-4">
        <h2 className="font-semibold mb-2 text-lg">Người trực ca:</h2>
        {selectedUsers ? (
          <ul className="list-disc pl-5 space-y-1">
            {selectedUsers.map((u) => (
              <li key={u.id}>{u.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chọn 1 ca trong lịch để xem danh sách.</p>
        )}
      </div>
    </div>
  );
}
