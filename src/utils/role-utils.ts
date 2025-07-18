import type { UserRole } from '@/types/user';

/**
 * Color styles for user role badges
 */
export const roleBadgeStyles: Record<UserRole, string> = {
  Guest: 'bg-gray-100 text-gray-800 border-gray-200',
  Customer: 'bg-blue-100 text-blue-800 border-blue-200',
  Manager: 'bg-purple-100 text-purple-800 border-purple-200',
  Admin: 'bg-red-100 text-red-800 border-red-200',
  FacilityStaff: 'bg-green-100 text-green-800 border-green-200',
  HomeStaff: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  TestStaff: 'bg-orange-100 text-orange-800 border-orange-200',
  ShipStaff: 'bg-teal-100 text-teal-800 border-teal-200',
};

/**
 * Get a user-friendly display name for a role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    Guest: 'Khách',
    Customer: 'Khách hàng',
    Manager: 'Quản lý',
    Admin: 'Quản trị viên',
    FacilityStaff: 'Nhân viên cơ sở',
    HomeStaff: 'Nhân viên tại nhà',
    TestStaff: 'Nhân viên xét nghiệm',
    ShipStaff: 'Nhân viên vận chuyển',
  };

  return displayNames[role] || role;
};
