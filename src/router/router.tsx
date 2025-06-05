import DashboardLayout from '@/components/layout/dashboard-layout/dashboard-layout';
import MainLayout from '@/components/layout/main-layout/main-layout';
import DashboardPage from '@/pages/dashboard';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ServicePage from '@/pages/dashboard/service';
import { paths } from '@/utils/constant/path';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import ProfilePage from '@/pages/profile';
import PublicRoute from './public-route';
import ServiceDetailPage from '@/pages/service-detail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: paths.profile,
        element: <ProfilePage />,
      },
      {
        path: paths.serviceDetail(':id'),
        element: <ServiceDetailPage />,
      },
      {
        element: <PublicRoute />,
        children: [
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
      // {
      //   path: paths.profile,
      //   element: <ProfilePage />,
      // },
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: paths.services,
        element: <ServicePage />,
      },

      // Add other dashboard routes here
    ],
  },
  {
    path: paths.notFound,
    element: <Navigate to={paths.home} />,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
