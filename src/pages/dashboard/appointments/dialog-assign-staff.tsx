import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { Booking } from '@/types/booking';
import { translateRoleToVietnamese, type User } from '@/types/user';
import { useEffect, useState } from 'react';
import { getSamplesByBookingId } from '@/services/sample_service';
import type { Sample } from '@/types/sample';

type Props = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  employees: User[];
  assignedEmployee: string;
  setAssignedEmployee: (value: string) => void;
  onSave: () => void;
};

const isPastCollectionDate = (dateStr?: string) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
};

export default function AssignStaffDialog({
  booking,
  open,
  onClose,
  employees,
  assignedEmployee,
  setAssignedEmployee,
  onSave,
}: Props) {
  if (!booking) return null;

  const schedule = booking.sampleCollectionSchedules[0];
  const [isEditing, setIsEditing] = useState(false);
  const [samples, setSamples] = useState<Sample[]>([]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const sampleInfor = await getSamplesByBookingId(booking.bookingId);
        setSamples(sampleInfor);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu samples:', error);
      }
    };

    fetchSamples();
  }, [booking.bookingId]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='!w-full !max-w-[95vw] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Chi tiết đơn</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700'>
          {/* Booking Info */}
          <div className='border rounded-xl p-4 bg-gray-50'>
            <p className='font-semibold mb-2'>Chi tiết</p>
            <div className='space-y-1'>
              <div>
                <strong>Mã đơn:</strong> {booking.bookingId}
              </div>
              <div>
                <strong>Người đặt:</strong> {booking.fullName}
              </div>
              <div>
                <strong>Loại dịch vụ :</strong> {booking.method}
              </div>
              <div>
                <strong>Địa chỉ :</strong> {schedule?.location || 'N/A'}
              </div>
              <div>
                <strong>Trạng thái:</strong> {booking.status}
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className='border rounded-xl p-4 bg-gray-50'>
            <p className='font-semibold mb-2'>Thời gian</p>
            <div className='space-y-1'>
              <div>
                <strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Ngày thu mẫu:</strong>{' '}
                {schedule?.collectionDate
                  ? new Date(schedule.collectionDate).toLocaleDateString()
                  : 'N/A'}
              </div>
              <div>
                <strong>Thời gian:</strong> {schedule?.time || 'N/A'}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className='border rounded-xl p-4 bg-gray-50'>
            <p className='font-semibold mb-2'>Thông tin mẫu</p>
            <div className='overflow-x-auto'>
              {samples.length > 0 ? (
                <table className='min-w-full text-sm text-gray-700'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='px-4 py-2 text-left font-semibold'>Mã mẫu</th>
                      <th className='px-4 py-2 text-left font-semibold'>Tên người tham gia</th>
                      <th className='px-4 py-2 text-left font-semibold'>Quan hệ</th>
                      <th className='px-4 py-2 text-left font-semibold'>Loại mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((sample) => (
                      <tr key={sample.sampleId} className='border-b'>
                        <td className='px-4 py-2'>{sample.sampleId}</td>
                        <td className='px-4 py-2'>{sample.participantName || 'N/A'}</td>
                        <td className='px-4 py-2'>{sample.notes || 'N/A'}</td>
                        <td className='px-4 py-2'>{sample.sampleType || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='italic text-gray-500 text-center py-2'>Không có mẫu nào</div>
              )}
            </div>
          </div>

          {/* Phân công */}
          <div className='border rounded-xl p-4 bg-gray-50'>
            <p className='font-semibold mb-2'>Phân công nhân viên</p>
            {schedule?.collectorId && !isEditing ? (
              <div className='flex items-center gap-2 mt-1'>
                <p>
                  Đã phân công cho: <span className='font-medium'>{schedule.collectorName}</span>
                </p>
                <Button
                  size='sm'
                  variant='outline'
                  className='text-xs'
                  onClick={() => setIsEditing(true)}
                >
                  Đổi nhân viên
                </Button>
              </div>
            ) : isPastCollectionDate(schedule?.collectionDate) ? (
              <p className='italic text-gray-500 mt-1'>Đã quá hạn – không thể phân công</p>
            ) : (
              <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Chọn nhân viên' />
                </SelectTrigger>
                <SelectContent>
                  {employees.length === 0 ? (
                    <SelectItem value='NULL' disabled>
                      Không có nhân viên nào
                    </SelectItem>
                  ) : (
                    employees.map((emp) => (
                      <SelectItem key={emp.userId} value={emp.userId.toString()}>
                        {emp.fullName} - vai trò: {translateRoleToVietnamese(emp.role)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        {(!schedule?.collectorId && !isPastCollectionDate(schedule?.collectionDate)) ||
        isEditing ? (
          <div className='flex justify-end gap-3 mt-6'>
            <Button className='bg-green-600 text-white' onClick={onSave}>
              Lưu thay đổi
            </Button>
            <Button variant='secondary' onClick={onClose}>
              Hủy
            </Button>
          </div>
        ) : (
          <div className='flex justify-end gap-3 mt-6'>
            <Button variant='secondary' onClick={onClose}>
              Đóng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
