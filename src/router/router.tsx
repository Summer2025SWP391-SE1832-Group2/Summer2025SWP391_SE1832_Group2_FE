import BlogPage from '@/pages/blog';
import BlogTypePage from '@/pages/blog/blogType';
import DashboardLayout from '@/components/layout/dashboard-layout/dashboard-layout';
import MainLayout from '@/components/layout/main-layout/main-layout';
import DashboardPage from '@/pages/dashboard';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';

import ProfilePage from '@/pages/profile';
import RegisterPage from '@/pages/register';
import ServiceDetailPage from '@/pages/service-detail';
import ServicePage from '@/pages/dashboard/service';
import { paths } from '@/utils/constant/path';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import AppointmentsPage from '@/pages/appointments';
import PublicRoute from './public-route';
import {
  //  PaymentFailedPage,
  PaymentSuccessPage,
} from '@/pages/payment';
import BookingHistoryPage from '@/pages/booking-history';
import BookingDetailPage from '@/pages/booking-detail';
import ResultPage from '@/pages/result';
import BookingListPage from '@/pages/booking-list';
import AddResultPage from '@/pages/add-result';
import StaffSchedulePage from '@/pages/staff-schedule';

import ResetPasswordPage from '@/pages/reset-password';
import BlogManagePage from '@/pages/blog-manage';
import BlogCreatePage from '@/pages/blog-manage/blog-create';

const router = createBrowserRouter([
  {
    path: paths.home,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: paths.blog,
        element: <BlogPage />,
      },
      {
        path: paths.blogType,
        element: <BlogTypePage />,
      },
      {
        path: paths.paymentSuccess,
        element: <PaymentSuccessPage />,
      },
      {
        path: paths.bookingHistory,
        element: <BookingHistoryPage />,
      },

      {
        path: paths.bookingDetail(':id'),
        element: <BookingDetailPage />,
      },
      {
        path: paths.profile,
        element: <ProfilePage />,
      },
      {
        path: paths.result,
        element: <ResultPage />,
      },
      {
        path: paths.serviceDetail(':id'),
        element: <ServiceDetailPage />,
      },
      // {
      //   path: "/test",
      //   element: < />,
      // },
      {
        element: <PublicRoute />,
        children: [
          {
            path: paths.resetPassword,
            element: <ResetPasswordPage />,
          },
          {
            path: paths.login,
            element: <LoginPage />,
          },
          {
            path: paths.register,
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    path: paths.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: paths.dashboardProfile,
        element: <ProfilePage />,
      },
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: paths.appointments,
        element: <AppointmentsPage />,
      },
      {
        path: paths.services,
        element: <ServicePage />,
      },
      {
        path: paths.bookingList,
        element: <BookingListPage />,
      },
      {
        path: paths.addResult,
        element: <AddResultPage />,
      },
      {
        path: paths.staffschedule,
        element: <StaffSchedulePage />,
      },
      {
        path: paths.blogmanage,
        element: <BlogManagePage />,
       
      },
      {
        path: paths.blogcreate,
        element: <BlogCreatePage />,
      }

      // Add other dashboard routes here
    ],
  },
  {
    path: paths.notFound,
    element: <div>404 - Page Not Found</div>,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
