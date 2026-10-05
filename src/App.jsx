import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ClienteLayout from './components/ClienteLayout';
import TecnicoLayout from './components/TecnicoLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import ForgotPassword from './pages/Login/ForgotPassword';

// Admin Pages
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import Inventario from './pages/Admin/Inventario';
import CitasAdmin from './pages/Admin/CitasAdmin';
import Facturas from './pages/Admin/Facturas';
import QuejasAdmin from './pages/Admin/QuejasAdmin';
import VerificacionPagos from './pages/Admin/VerificacionPagos';
import GestionUsuarios from './pages/Admin/GestionUsuarios';
import Finanzas from './pages/Admin/Finanzas';

// Tecnico Pages
import AgendaTecnico from './pages/Tecnico/AgendaTecnico';
import DetalleCita from './pages/Tecnico/DetalleCita';
import InsumosTecnico from './pages/Tecnico/InsumosTecnico';

// Cliente Pages
import EstatusCita from './pages/Cliente/EstatusCita';
import SolicitarServicio from './pages/Cliente/SolicitarServicio';
import MisFacturas from './pages/Cliente/MisFacturas';
import CrearQueja from './pages/Cliente/CrearQueja';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes - With Sidebar Layout */}
        <Route element={<ProtectedRoute allowedRoles={['tecnico']}><TecnicoLayout /></ProtectedRoute>}>
          {/* Tecnico Routes */}
          <Route path="/tecnico/servicios" element={<AgendaTecnico />} />
          <Route path="/tecnico/historial" element={<DetalleCita />} />
          {/* Redirect old routes to new ones */}
          <Route path="/tecnico/agenda" element={<Navigate to="/tecnico/servicios" replace />} />
          <Route path="/tecnico/detalle-cita" element={<Navigate to="/tecnico/historial" replace />} />
          <Route path="/tecnico/insumos" element={<Navigate to="/tecnico/servicios" replace />} />
        </Route>

        {/* Admin Routes - With AdminLayout */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/citas" element={<CitasAdmin />} />
          <Route path="/admin/verificacion-pagos" element={<VerificacionPagos />} />
          <Route path="/admin/inventario" element={<Inventario />} />
          <Route path="/admin/usuarios" element={<GestionUsuarios />} />
          <Route path="/admin/facturas" element={<Facturas />} />
          <Route path="/admin/quejas" element={<QuejasAdmin />} />
          <Route path="/admin/finanzas" element={<Finanzas />} />
        </Route>

        {/* Cliente Routes - With ClienteLayout */}
        <Route element={<ProtectedRoute allowedRoles={['cliente']}><ClienteLayout /></ProtectedRoute>}>
          <Route path="/cliente/estatus-cita" element={<EstatusCita />} />
          <Route path="/cliente/solicitar-servicio" element={<SolicitarServicio />} />
          <Route path="/cliente/mis-facturas" element={<MisFacturas />} />
          <Route path="/cliente/quejas" element={<CrearQueja />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
