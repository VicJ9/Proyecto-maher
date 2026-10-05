import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  Package, 
  Users, 
  LogOut,
  Shield,
  Building2,
  Receipt,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const userEmail = localStorage.getItem('maher_user_email') || 'admin@empresa.com';
  const userName = localStorage.getItem('maher_user_name') || 'Administrador';

  const navItems = [
    { path: '/admin/dashboard', label: 'Panel General', icon: LayoutDashboard },
    { path: '/admin/citas', label: 'Gestión de Citas', icon: Calendar },
    { path: '/admin/verificacion-pagos', label: 'Verificación de Pagos', icon: CreditCard },
    { path: '/admin/facturas', label: 'Facturación', icon: Receipt },
    { path: '/admin/inventario', label: 'Inventario / Repuestos', icon: Package },
    { path: '/admin/usuarios', label: 'Técnicos y Clientes', icon: Users },
    { path: '/admin/quejas', label: 'Quejas y Reclamos', icon: AlertTriangle },
    { path: '/admin/finanzas', label: 'Panel Financiero', icon: DollarSign },
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
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">MAHER PROYECT</h1>
              <p className="text-xs text-gray-500">Panel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
