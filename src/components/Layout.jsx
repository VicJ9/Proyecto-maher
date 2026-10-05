import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  
  const isAuthRoute = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/forgot-password';

  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;