import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Receipt, LogOut, User, PlusCircle, AlertTriangle } from 'lucide-react';

const ClienteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('maher_user_email') || 'cliente@empresa.com';
  const userName = localStorage.getItem('maher_user_name') || 'Cliente';

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('maher_user_email');
    localStorage.removeItem('maher_user_name');
    localStorage.removeItem('maher_user_role');
    localStorage.removeItem('maher_user_token');
    // Redirigir al login
    navigate('/');
  };

  const navItems = [
    { path: '/cliente/estatus-cita', label: 'Mis Citas', icon: Calendar },
    { path: '/cliente/solicitar-servicio', label: 'Solicitar Servicio', icon: PlusCircle },
    { path: '/cliente/mis-facturas', label: 'Mis Facturas', icon: Receipt },
    { path: '/cliente/quejas', label: 'Crear Queja', icon: AlertTriangle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">MAHER PROYECT</h1>
            <p className="text-sm text-gray-500">Portal de Clientes</p>
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
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
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

export default ClienteLayout;