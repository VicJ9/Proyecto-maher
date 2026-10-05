import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userRole = localStorage.getItem('maher_user_role');
  const userToken = localStorage.getItem('maher_user_token');

  // Verificar si el usuario está autenticado
  if (!userToken) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el usuario tiene el rol permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Si es cliente, redirigir al portal del cliente
    if (userRole === 'cliente') {
      return <Navigate to="/cliente/estatus-cita" replace />;
    }
    // Si es admin, redirigir al panel del admin
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Si es tecnico, redirigir a la agenda
    if (userRole === 'tecnico') {
      return <Navigate to="/tecnico/agenda" replace />;
    }
    // Por defecto, redirigir al login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
