import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, CreditCard, Users, Package, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { getCitasCliente, getFacturasCliente, getInventario, getTecnicos } from '../../services/api';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    citasPendientes: 0,
    pagosPorVerificar: 0,
    clientesActivos: 0,
    stockBajo: 0,
    citasCompletadas: 0,
    ingresosTotales: 0
  });
  const [citasRecientes, setCitasRecientes] = useState([]);
  const [pagosRecientes, setPagosRecientes] = useState([]);
  const [tecnicosTop, setTecnicosTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Cargar citas
        const citas = await getCitasCliente();
        const citasPendientes = citas.filter(c => 
          c.estatus === 'Pendiente' || c.estatus === 'Programado'
        ).length;
        const citasCompletadas = citas.filter(c => 
          c.estatus === 'Completado' || c.estatus === 'Pago Verificado'
        ).length;
        
        // Cargar facturas
        const facturas = await getFacturasCliente();
        const pagosPorVerificar = facturas.filter(f => f.estatus === 'En Verificación').length;
        const clientesUnicos = [...new Set(facturas.map(f => f.clienteEmail))].length;
        const ingresosTotales = facturas
          .filter(f => f.estatus === 'Pagada' || f.estatus === 'Pago Parcial')
          .reduce((sum, f) => {
            const monto = parseFloat(f.montoFactura || f.monto?.replace('$', '') || 0);
            return sum + monto;
          }, 0);

        // Cargar inventario
        const inventario = await getInventario();
        const stockBajo = inventario.filter(i => i.stock <= i.stockMin).length;

        // Cargar técnicos
        const tecnicos = await getTecnicos();
        
        // Calcular top técnicos por servicios completados
        const tecnicosConServicios = tecnicos.map(tecnico => {
          const serviciosCompletados = citas.filter(c => 
            c.tecnicoAsignado === tecnico.email && 
            (c.estatus === 'Completado' || c.estatus === 'Pago Verificado')
          ).length;
          return { ...tecnico, serviciosCompletados };
        }).sort((a, b) => b.serviciosCompletados - a.serviciosCompletados).slice(0, 5);

        setStats({
          citasPendientes,
          pagosPorVerificar,
          clientesActivos: clientesUnicos,
          stockBajo,
          citasCompletadas,
          ingresosTotales
        });

        setCitasRecientes(citas.slice(-5).reverse());
        setPagosRecientes(facturas.slice(-5).reverse());
        setTecnicosTop(tecnicosConServicios);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (estatus) => {
    switch (estatus) {
      case 'Completado':
      case 'Pago Verificado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Programado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En Verificación':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pagada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel General</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className={stats.citasPendientes > 20 ? "text-red-600" : "text-green-600"} className="text-sm font-medium flex items-center">
              {stats.citasPendientes > 20 ? <AlertTriangle className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
              {stats.citasPendientes > 20 ? 'Alto' : 'Normal'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.citasPendientes}</h3>
          <p className="text-sm text-gray-500">Citas Pendientes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <span className={stats.pagosPorVerificar > 5 ? "text-orange-600" : "text-green-600"} className="text-sm font-medium flex items-center">
              {stats.pagosPorVerificar > 5 ? <Clock className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              {stats.pagosPorVerificar > 5 ? 'Pendientes' : 'OK'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.pagosPorVerificar}</h3>
          <p className="text-sm text-gray-500">Pagos por Verificar</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Activo
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.clientesActivos}</h3>
          <p className="text-sm text-gray-500">Clientes Activos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <span className={stats.stockBajo > 0 ? "text-red-600" : "text-green-600"} className="text-sm font-medium flex items-center">
              {stats.stockBajo > 0 ? <AlertTriangle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              {stats.stockBajo > 0 ? 'Alerta' : 'OK'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.stockBajo}</h3>
          <p className="text-sm text-gray-500">Stock Bajo</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-emerald-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.citasCompletadas}</h3>
          <p className="text-sm text-gray-500">Servicios Completados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${stats.ingresosTotales.toFixed(2)}</h3>
          <p className="text-sm text-gray-500">Ingresos Totales (USD)</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Citas Recientes</h2>
          <div className="space-y-3">
            {citasRecientes.length > 0 ? citasRecientes.map((cita, index) => (
              <div key={`${cita.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{cita.equipo} - {cita.servicio}</p>
                  <p className="text-sm text-gray-500">Cliente: {cita.cliente || 'Por asignar'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cita.estatus)}`}>
                  {cita.estatus}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay citas recientes</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pagos Recientes</h2>
          <div className="space-y-3">
            {pagosRecientes.length > 0 ? pagosRecientes.map((factura, index) => (
              <div key={`${factura.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{factura.id}</p>
                  <p className="text-sm text-gray-500">Monto: {factura.monto}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(factura.estatus)}`}>
                  {factura.estatus}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay pagos recientes</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Técnicos</h2>
          <div className="space-y-3">
            {tecnicosTop.length > 0 ? tecnicosTop.map((tecnico, index) => (
              <div key={tecnico.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tecnico.nombre}</p>
                    <p className="text-sm text-gray-500">{tecnico.email}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {tecnico.serviciosCompletados} servicios
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay técnicos registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
