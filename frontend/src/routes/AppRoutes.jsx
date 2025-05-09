import { Routes, Route, Navigate } from 'react-router-dom'; // Importe o Navigate
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import TaskList from '../pages/TaskList';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota de redirecionamento da raiz ("/") para "/login" */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        }
      />
      {/* Rota padrão 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
