import type { UserRole } from '@/types/user';

/**
 * Application route constants
 */
export const paths = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  blog: '/blog-type/blog/:blogTypeId',
  blogType: '/blog-type',

  profile: 'profile',
  transaction: '/transaction',
  resetPassword: '/reset-password',
  result: '/result/:id',
  bookingHistory: '/bookinghistory',
  booking: (serviceId: string) => `/booking/${serviceId}`,
  bookingDetail: (bookingId: string) => `/bookingdetail/${bookingId}`,
  blogdetail: (blogId: string) => `/viewblog/${blogId}`,

  // Protected routes
  staff: {
    dashboard: '/staff',
    appointments: '/staff/appointments',
    scheduleforstaff: '/staff/schedules',
    bookingList: '/staff/bookinglist',
    addResult: '/staff/result/add/:id',
    profile: '/staff/profile',

  },

  // Manager routes
  manager: {
    dashboard: '/manager',
    appointments: '/manager/appointments',
    staffSchedules: '/manager/staffschedules',
    schedules: '/manager/schedules',
    services: '/manager/services',
    blogManage: '/manager/blogmanage',
    blogCreate: '/manager/blogmanage/blogcreate',
    blogDetail: (blogId: string) => `/manager/blogmanage/blogdetail/${blogId}`,
    parameterList: '/manager/parameterlist',
    testParameterList: '/manager/testparameterlist',
    testParameterDetail: (serviceId: string) => `/manager/testparameterdetail/${serviceId}`,
    bookingList: '/manager/bookinglist',
    addResult: '/manager/result/add/:id',
    profile: '/manager/profile',
    // users: '/manager/users',
  },

  // Admin routes
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    parameterList: '/admin/parameterlist',
    testParameterList: '/admin/testparameterlist',
    profile: '/admin/profile',


  },
  // Payment results
  paymentSuccess: '/payment-success',
  paymentFailed: '/payment-failed',

  // Fallback
  notFound: '*',
} as const;

export const getDefaultRouteByRole = (role?: UserRole) => {
  switch (role) {
    case 'FacilityStaff':
    case 'HomeStaff':
    case 'TestStaff':
    case 'ShipStaff':
      return paths.staff.dashboard;
    case 'Manager':
      return paths.manager.dashboard;
    case 'Admin':
      return paths.admin.dashboard;
    case 'Customer':
      return paths.home;
    default:
      return paths.login;
  }
};
