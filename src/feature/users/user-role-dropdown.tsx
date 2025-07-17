import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/useUser';
import { type User, type UserRole } from '@/types/user';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { UserStatusBadge } from './user-status-badge';
import { useToast } from '@/components/ui/toast';

interface UserRoleDropdownProps {
  user: User;
}

export const UserRoleDropdown = ({ user }: UserRoleDropdownProps) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(user.role);
  const { updateRoleMutation } = useUser();
  const { showToast } = useToast();

  const availableRoles: UserRole[] = [
    'Manager',
    'FacilityStaff',
    'HomeStaff',
    'TestStaff',
    'ShipStaff',
    'Customer',
  ];

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({
        userId: user.userId,
        newRole,
      });
      setCurrentRole(newRole);
      showToast(`Đã cập nhật vai trò thành ${newRole}`, 'success');
    } catch (error) {
      showToast('Không thể cập nhật vai trò', 'error');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-1 p-1 h-auto'>
          <UserStatusBadge role={currentRole} />
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Chọn vai trò</DropdownMenuLabel>
        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleChange(role)}
            className={currentRole === role ? 'bg-accent' : ''}
          >
            <UserStatusBadge role={role} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
