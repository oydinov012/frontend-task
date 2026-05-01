import { createBrowserRouter, Navigate } from 'react-router';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import TasksPage from './components/tasks/TasksPage';
import HistoryPage from './components/history/HistoryPage';
import ProfilePage from './components/profile/ProfilePage';
import { isAuthenticated } from './lib/api';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/tasks" replace /> },
      { path: 'tasks', Component: TasksPage },
      { path: 'history', Component: HistoryPage },
      { path: 'profile', Component: ProfilePage },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
