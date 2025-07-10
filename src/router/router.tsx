import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/main-layout/main-layout';
import DashboardLayout from '@/components/layout/dashboard-layout/dashboard-layout';
import ProtectedRoute from './protected-route';
import PublicRoute from './public-route';

import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ResetPasswordPage from '@/pages/reset-password';
import { TransactionPage } from '@/pages/transaction';

import BlogPage from '@/pages/blog';
import BlogType from '@/pages/blog/blogType';
import BlogDetailHomePage from '@/pages/blog/blogDetail';
import BlogManagementPage from '@/pages/blog-manage';
import BlogCreatePage from '@/pages/blog-manage/blog-create';
import BlogDetailManagePage from '@/pages/blog-manage/blog-detail';

import BookingPage from '@/pages/booking';
import BookingDetailPage from '@/pages/booking-detail';
import BookingHistoryPage from '@/pages/booking-history';
import BookingListPage from '@/pages/add-sample';
import AddResultPage from '@/pages/add-result';

import AppointmentsPage from '@/pages/dashboard/appointments';
import StaffSchedulePage from '@/pages/staff-schedule';
import UserSchedulePage from '@/pages/staff-schedule/user_chedulePage';

import ServicePage from '@/pages/dashboard/service';
import ParameterPage from '@/pages/parameter-management';
import TestParameterPage from '@/pages/test-parameter-management';
import TestParameterDetailPage from '@/pages/test-parameter-detail';

import ResultPage from '@/pages/result';
import ProfilePage from '@/pages/profile';

import PaymentSuccessPage from '@/pages/payment/success';
import PaymentFailedPage from '@/pages/payment/failed';
import NotFoundPage from '@/pages/error';

import DashboardPage from '@/pages/dashboard';
import { paths } from '@/utils/constant/path';


const router = createBrowserRouter([
  // Public Pages
  {
    path: paths.home,
    element: <MainLayout />, 
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.blog, element: <BlogPage /> },
      { path: paths.blogType, element: <BlogType /> },
      { path: paths.paymentSuccess, element: <PaymentSuccessPage /> },
      { path: paths.paymentFailed, element: <PaymentFailedPage /> },
      { path: paths.bookingHistory, element: <BookingHistoryPage /> },
      { path: paths.profile, element: <ProfilePage /> },
      { path: paths.result, element: <ResultPage /> },
      { path: paths.booking(':serviceId'), element: <BookingPage /> },
      { path: paths.bookingDetail(':id'), element: <BookingDetailPage /> },
      { path: paths.blogdetail(':blogId'), element: <BlogDetailHomePage /> },
      {
        element: <PublicRoute />,
        children: [
          { path: paths.login, element: <LoginPage /> },
          { path: paths.register, element: <RegisterPage /> },
          { path: paths.resetPassword, element: <ResetPasswordPage /> },
        ],
      },
      {
        path: paths.transaction,
        element: (
          <ProtectedRoute>
            <TransactionPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Staff Routes
  {
    path: paths.staff.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: paths.staff.appointments, element: <AppointmentsPage /> },
      { path: paths.staff.scheduleforstaff, element: <UserSchedulePage /> },
      { path: paths.staff.bookingList, element: <BookingListPage /> },
    ],
  },

  // Manager Routes
  {
    path: paths.manager.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: paths.manager.appointments, element: <AppointmentsPage /> },
      { path: paths.manager.staffSchedules, element: <StaffSchedulePage /> },
      { path: paths.manager.schedules, element: <UserSchedulePage /> },
      { path: paths.manager.services, element: <ServicePage /> },
      { path: paths.manager.bookingList, element: <BookingListPage /> },
      { path: paths.manager.addResult, element: <AddResultPage /> },
      { path: paths.manager.blogManage, element: <BlogManagementPage /> },
      { path: paths.manager.blogCreate, element: <BlogCreatePage /> },
      { path: paths.manager.blogDetail(':blogId'), element: <BlogDetailManagePage /> },
      { path: paths.manager.parameterList, element: <ParameterPage /> },
      { path: paths.manager.testParameterList, element: <TestParameterPage /> },
      { path: paths.manager.testParameterDetail(':serviceId'), element: <TestParameterDetailPage /> },
    ],
  },

  // Admin Routes
  {
    path: paths.admin.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: paths.admin.users, element: <DashboardPage /> }, // Replace with actual UsersPage
      { path: paths.admin.parameterList, element: <ParameterPage /> },
      { path: paths.admin.testParameterList, element: <TestParameterPage /> },
    ],
  },

  // Not Found
  {
    path: paths.notFound,
    element: <NotFoundPage />,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;