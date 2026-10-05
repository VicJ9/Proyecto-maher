import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, ClipboardList, LogOut, User, Wrench } from 'lucide-react';

const TecnicoLayout = () => {
  const location = useLocation();
  const userEmail = localStorage.getItem('maher_user_email') || 'tecnico@empresa.com';
  const userName = localStorage.getItem('maher_user_name') || 'Técnico';

  const navItems = [
    { path: '/tecnico/servicios', label: 'Mis Servicios Asignados', icon: ClipboardList },
    { path: '/tecnico/historial', label: 'Historial de Trabajos', icon: Calendar },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('maher_user_email');
    localStorage.removeItem('maher_user_name');
    localStorage.removeItem('maher_user_role');
    localStorage.removeItem('maher_user_token');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">MAHER PROYECT</h1>
            <p className="text-sm text-gray-500">Panel de Técnico</p>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : ''
                      }`}
                    >
                      <Icon className="w-6 h-6 text-gray-500" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-6 h-6 text-gray-500" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default TecnicoLayout;
