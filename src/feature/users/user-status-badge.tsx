import { Badge } from '@/components/ui/badge';
import { type UserRole } from '@/types/user';

interface UserStatusBadgeProps {
  role: UserRole;
}

export const UserStatusBadge = ({ role }: UserStatusBadgeProps) => {
  const variants: Record<
    UserRole,
    { variant: 'default' | 'outline' | 'secondary' | 'destructive'; label: string }
  > = {
    Admin: {
      variant: 'destructive',
      label: 'Admin',
    },
    Manager: {
      variant: 'secondary',
      label: 'Quản lý',
    },
    FacilityStaff: {
      variant: 'default',
      label: 'Nhân viên cơ sở',
    },
    HomeStaff: {
      variant: 'default',
      label: 'Nhân viên tại nhà',
    },
    TestStaff: {
      variant: 'default',
      label: 'Nhân viên xét nghiệm',
    },
    ShipStaff: {
      variant: 'default',
      label: 'Nhân viên giao hàng',
    },
    Customer: {
      variant: 'outline',
      label: 'Khách hàng',
    },
    Guest: {
      variant: 'outline',
      label: 'Khách',
    },
  };

  const { variant, label } = variants[role] || { variant: 'outline', label: role };

  return <Badge variant={variant}>{label}</Badge>;
};
