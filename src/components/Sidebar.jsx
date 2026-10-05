import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  FileText, 
  MessageSquare,
  Clock,
  ClipboardList,
  Wrench,
  Receipt,
  AlertCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    // Admin routes
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'admin' },
    { path: '/admin/inventario', label: 'Inventario', icon: Package, role: 'admin' },
    { path: '/admin/citas', label: 'Citas', icon: Calendar, role: 'admin' },
    { path: '/admin/facturas', label: 'Facturas', icon: Receipt, role: 'admin' },
    { path: '/admin/quejas', label: 'Quejas', icon: MessageSquare, role: 'admin' },
    
    // Tecnico routes
    { path: '/tecnico/agenda', label: 'Agenda', icon: Clock, role: 'tecnico' },
    { path: '/tecnico/detalle-cita', label: 'Detalle Cita', icon: ClipboardList, role: 'tecnico' },
    { path: '/tecnico/insumos', label: 'Insumos', icon: Wrench, role: 'tecnico' },
    
    // Cliente routes
    { path: '/cliente/estatus', label: 'Estatus Cita', icon: Clock, role: 'cliente' },
    { path: '/cliente/facturas', label: 'Mis Facturas', icon: Receipt, role: 'cliente' },
    { path: '/cliente/quejas', label: 'Crear Queja', icon: AlertCircle, role: 'cliente' },
  ];

  const getCurrentRole = () => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/tecnico')) return 'tecnico';
    if (location.pathname.startsWith('/cliente')) return 'cliente';
    return null;
  };

  const currentRole = getCurrentRole();
  const filteredNavItems = navItems.filter(item => item.role === currentRole);

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Maher Proyect</h1>
        <p className="text-sm text-gray-500 capitalize">{currentRole || 'Sistema'}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;