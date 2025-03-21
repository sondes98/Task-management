import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthState } from '../features/auth/types';
import Dashboard from '../pages/Dashboard';
import TaskForm from '../pages/TaskForm';
import AccessDenied from '../pages/AccessDenied';
import Login from '../pages/Login';
import Register from '../pages/Register';

const ProtectedRoute: React.FC<{ children: React.ReactElement; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth as AuthState);

  if (!accessToken) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/access-denied" />;
  return children;
};

const AppRoutes: React.FC = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth as AuthState);

  return (
    <Routes>
      <Route path="/login" element={accessToken ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={accessToken ? <Navigate to="/dashboard" /> : <Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-form"
        element={
          <ProtectedRoute>
            <TaskForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-form/:id"
        element={
          <ProtectedRoute>
            <TaskForm />
          </ProtectedRoute>
        }
      />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;