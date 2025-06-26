import DashboardLayout from '@/components/layout/dashboard-layout/dashboard-layout';
import MainLayout from '@/components/layout/main-layout/main-layout';
import BlogPage from '@/pages/blog';
import BlogType from '@/pages/blog/blogType';
import DashboardPage from '@/pages/dashboard';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import AddResultPage from '@/pages/add-result';
import BookingPage from '@/pages/booking';
import BookingDetailPage from '@/pages/booking-detail';
import BookingHistoryPage from '@/pages/booking-history';
import BookingListPage from '@/pages/booking-list';
import AppointmentsPage from '@/pages/dashboard/appointments';
import ServicePage from '@/pages/dashboard/service';
import { PaymentFailedPage, PaymentSuccessPage } from '@/pages/payment';
import ProfilePage from '@/pages/profile';
import RegisterPage from '@/pages/register';
import ResetPasswordPage from '@/pages/reset-password';
import ResultPage from '@/pages/result';
import { paths } from '@/utils/constant/path';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import PublicRoute from './public-route';
import BlogDetailManagePage from '@/pages/blog-manage/blog-detail';
import BlogDetailHomePage from '@/pages/blog/blogDetail';
import BlogCreatePage from '@/pages/blog-manage/blog-create';
import StaffSchedulePage from '@/pages/staff-schedule';
import BlogManagementPage from '@/pages/blog-manage';
import UserSchedulePage from '@/pages/staff-schedule/user_chedulePage';
import { TransactionPage } from '@/pages/transaction';

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
        element: <BlogType />,
      },
      {
        path: paths.paymentSuccess,
        element: <PaymentSuccessPage />,
      },
      {
        path: paths.paymentFailed,
        element: <PaymentFailedPage />,
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
        path: paths.booking(':serviceId'),
        element: <BookingPage />,
      },
      {
        path: paths.blogdetail(':blogId'),
        element: <BlogDetailHomePage />,
      },
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
  {
    path: paths.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: paths.dashboardProfile,
        element: <ProfilePage />,
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
        element: <BlogManagementPage />,
      },
      {
        path: paths.blogcreate,
        element: <BlogCreatePage />,
      },
      {
        path: paths.blogdetailManage(':blogId'),
        element: <BlogDetailManagePage />,
      },
      {
        path: paths.scheduleforstaff,
        element: <UserSchedulePage />,
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
