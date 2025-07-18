type User = {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  identityNumber: string;
  address: string | null;
};

type UserRole =
  | 'Guest'
  | 'Customer'
  | 'Manager'
  | 'Admin'
  | 'FacilityStaff'
  | 'HomeStaff'
  | 'TestStaff'
  | 'ShipStaff';

 export function translateRoleToVietnamese(role: string): string {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Quản lý';
      case 'facilitystaff':
        return 'Nhân viên cơ sở';
      case 'homestaff':
        return 'Nhân viên tại nhà';
      case 'teststaff':
        return 'Nhân viên xét nghiệm';
        case 'shipstaff':
        return 'Nhân viên giao hàng';
      default:
        return role; 
    }
  }
  
export type { User, UserRole }  ;
