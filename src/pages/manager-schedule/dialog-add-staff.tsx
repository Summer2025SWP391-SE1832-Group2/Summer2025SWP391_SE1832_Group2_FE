// components/AddEmployeeDialog.tsx
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getAllUserRequests } from '@/services/user_service';
import { translateRoleToVietnamese, type User } from '@/types/user';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { createUserWorkSchedule } from '@/services/userworkschedule_service';
import { getUser_workScheduleBySlot } from '@/services/schedule_service';

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedSlot: number | null;
}

export default function AddEmployeeDialog({
  open,
  onClose,
  selectedDate,
  selectedSlot,
}: AddEmployeeDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      alert('Chưa chọn ngày hoặc slot!');
      return;
    }
    const today = new Date();
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      alert('Chỉ được thêm nhân viên từ ngày mai trở đi.');
      onClose();
      return;
    }
    const selectedUsers = users.filter((u) => selectedUserIds.has(u.userId));

    for (const user of selectedUsers) {
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');

        await createUserWorkSchedule({
          userId: user.userId,
          workScheduleId: selectedSlot,
          date: dateString,
        });
      } catch (err) {
        console.error(`Lỗi thêm ${user.fullName}:`, err);
      }
    }

    alert('Đã thêm nhân viên vào ca làm.');
    setSelectedUserIds(new Set());
    onClose();
  };
  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
      return newSet;
    });
  };
  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedDate || !selectedSlot) return;

      try {
        const userData = await getAllUserRequests();
        const staffUsers = userData.filter(
          (user) => user.role === 'HomeStaff' || user.role === 'FacilityStaff',
        );

        // Lấy danh sách đã phân công
        const dateString = format(selectedDate, 'yyyy/MM/dd');
        const assignedUsers = await getUser_workScheduleBySlot(selectedSlot, dateString);
        const assignedUserIds = new Set(assignedUsers.map((u) => u.userId));

        // Lọc ra những người chưa được phân công
        const availableUsers = staffUsers.filter((u) => !assignedUserIds.has(u.userId));
        setUsers(availableUsers);
      } catch (error) {
        console.error('Lỗi tải danh sách người dùng', error);
      }
    };
    fetchUsers();
  }, [selectedDate, selectedSlot, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhân viên vào slot</DialogTitle>
          <DialogDescription>
            Ngày: <strong>{selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn'}</strong>
            <br />
            Slot: <strong>{selectedSlot ?? 'Chưa chọn'}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Bạn có thể thêm form tại đây */}
        <div className='py-4'>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[60px]'>Thao tác</TableHead>
                <TableHead className='w-[60px]'>ID</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Vai trò</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.has(user.userId)}
                        onCheckedChange={() => toggleUser(user.userId)}
                      />
                    </TableCell>
                    <TableCell className='font-medium'>{user.userId}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{translateRoleToVietnamese(user.role)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className='text-center text-gray-500'>
                    Không có nhân viên nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className='mt-4'>
          <Button onClick={onClose}>Đóng</Button>
          <Button onClick={handleConfirm} disabled={selectedUserIds.size === 0}>
            Xác nhận
          </Button>{' '}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
