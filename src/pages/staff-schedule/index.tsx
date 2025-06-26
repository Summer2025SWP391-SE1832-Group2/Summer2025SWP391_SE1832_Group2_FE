import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { User } from '@/types/user';
import { getAllUserRequests } from '@/services/user_service';
import { getUserWorkScheduleUserById } from '@/services/userworkschedule_service';
import { useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export default function StaffSchedulePage() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUserRequests();
        setUsers(userData);
      } catch (error) {
        console.error('Lỗi tải danh sách người dùng', error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewCalendar = async (user: User) => {
    try {
      const schedule = await getUserWorkScheduleUserById(user.userId);
      console.log('Lịch làm việc:', schedule);
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

      navigate('/dashboard/schedules', { state: { user, events: mapped } });
    } catch (err) {
      console.error('Lỗi lấy lịch', err);
    }
  };
  return (
    <div className='p-6 h-[calc(100vh-64px)] w-full flex flex-col'>
      <table className='table-auto w-full border border-gray-300 mb-4'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='border px-3 py-2'>ID</th>
            <th className='border px-3 py-2'>Họ tên</th>
            <th className='border px-3 py-2'>Email</th>
            <th className='border px-3 py-2'>Chức Vụ</th>
            <th className='border px-3 py-2'>Xem lịch</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.userId}>
              <td className='border px-3 py-2'>{user.userId}</td>
              <td className='border px-3 py-2'>{user.fullName}</td>
              <td className='border px-3 py-2'>{user.email}</td>
              <td className='border px-3 py-2'>{user.role}</td>

              <td className='border px-3 py-2'>
                <button
                  className='bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700'
                  onClick={() => handleViewCalendar(user)}
                >
                  Xem lịch
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href='#'
                  isActive={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext href='#' onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
