import React, { useState, useEffect } from 'react';
import { getFacturasCliente, getTasaBCV } from '../../services/api';
import { DollarSign, TrendingUp, CreditCard, Banknote, Building2, Calendar, Filter, Download } from 'lucide-react';

const Finanzas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasaBCV, setTasaBCV] = useState(36.50);
  const [filterPeriod, setFilterPeriod] = useState('todos'); // 'todos', 'hoy', 'semana', 'mes'
  const [filterMethod, setFilterMethod] = useState('todos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturasData, tasa] = await Promise.all([
          getFacturasCliente(),
          getTasaBCV()
        ]);
        setFacturas(facturasData);
        setTasaBCV(tasa);
      } catch (err) {
        console.error('Error al cargar datos financieros:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterFacturasByPeriod = (facturas, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return facturas.filter(factura => {
      if (!factura.fechaPago) return false;
      const fechaPago = new Date(factura.fechaPago);
      
      switch (period) {
        case 'hoy':
          return fechaPago.toDateString() === today.toDateString();
        case 'semana':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return fechaPago >= weekAgo;
        case 'mes':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return fechaPago >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredFacturas = filterFacturasByPeriod(facturas, filterPeriod).filter(factura => {
    if (filterMethod === 'todos') return true;
    return factura.metodoPago === filterMethod;
  });

  const facturasPagadas = filteredFacturas.filter(f => 
    f.estatus === 'Pagada' || f.estatus === 'Pago Parcial'
  );

  const ingresosTotalesUSD = facturasPagadas.reduce((sum, f) => {
    const monto = parseFloat(f.montoFactura || f.monto?.replace('$', '') || 0);
    return sum + monto;
  }, 0);

  const ingresosTotalesBs = ingresosTotalesUSD * tasaBCV;

  const pagosPorMetodo = {
    'Pago Móvil': facturasPagadas.filter(f => f.metodoPago === 'Pago Móvil').length,
    'Transferencia': facturasPagadas.filter(f => f.metodoPago === 'Transferencia').length,
    'Zelle': facturasPagadas.filter(f => f.metodoPago === 'Zelle').length,
    'Efectivo': facturasPagadas.filter(f => f.metodoPago === 'Efectivo').length
  };

  const estadoCuentaPorCliente = () => {
    const cuentas = {};
    facturasPagadas.forEach(factura => {
      const cliente = factura.clienteEmail || 'cliente@empresa.com';
      if (!cuentas[cliente]) {
        cuentas[cliente] = {
          nombre: factura.clienteNombre || 'Cliente',
          pagado: 0,
          pendiente: 0
        };
      }
      const monto = parseFloat(factura.montoFactura || factura.monto?.replace('$', '') || 0);
      if (factura.estatus === 'Pagada') {
        cuentas[cliente].pagado += monto;
      } else if (factura.estatus === 'Pago Parcial') {
        cuentas[cliente].pagado += parseFloat(factura.montoAbonado || 0);
        cuentas[cliente].pendiente += parseFloat(factura.deudaRestante || 0);
      }
    });
    return Object.entries(cuentas).map(([email, data]) => ({ email, ...data }));
  };

  const clientesConCuenta = estadoCuentaPorCliente();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Financiero</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <h3 className="text-2xl font-bold text-gray-900">${ingresosTotalesUSD.toFixed(2)}</h3>
          <p className="text-sm text-gray-500">Ingresos Totales (USD)</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              BCV
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Bs. {ingresosTotalesBs.toFixed(2)}</h3>
          <p className="text-sm text-gray-500">Equivalente en Bolívares</p>
          <p className="text-xs text-gray-400 mt-1">Tasa: {tasaBCV.toFixed(2)} Bs/USD</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Pagadas
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{facturasPagadas.length}</h3>
          <p className="text-sm text-gray-500">Facturas Pagadas</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Activos
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{clientesConCuenta.length}</h3>
          <p className="text-sm text-gray-500">Clientes con Movimientos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los periodos</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los métodos</option>
            <option value="Pago Móvil">Pago Móvil</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Zelle">Zelle</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>
      </div>

      {/* Reportes por Método de Pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pagos por Método</h2>
          <div className="space-y-3">
            {Object.entries(pagosPorMetodo).map(([metodo, count]) => (
              <div key={metodo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{metodo}</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {count} pagos
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Estado de Cuenta por Cliente</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {clientesConCuenta.length > 0 ? clientesConCuenta.map((cliente) => (
              <div key={cliente.email} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{cliente.nombre}</span>
                  <span className="text-xs text-gray-500">{cliente.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Pagado:</p>
                    <p className="font-semibold text-green-600">${cliente.pagado.toFixed(2)}</p>
                  </div>
                  {cliente.pendiente > 0 && (
                    <div>
                      <p className="text-gray-500">Pendiente:</p>
                      <p className="font-semibold text-red-600">${cliente.pendiente.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay clientes con movimientos</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Transacciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Transacciones</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  N° Factura
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monto USD
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Equivalente Bs
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estatus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFacturas.map((factura, index) => {
                const montoUSD = parseFloat(factura.montoFactura || factura.monto?.replace('$', '') || 0);
                const montoBs = montoUSD * tasaBCV;
                return (
                  <tr key={`${factura.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {factura.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {factura.fechaPago || factura.fecha}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {factura.clienteNombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {factura.metodoPago || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      ${montoUSD.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      Bs. {montoBs.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        factura.estatus === 'Pagada' ? 'bg-green-100 text-green-800 border-green-200' :
                        factura.estatus === 'Pago Parcial' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {factura.estatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
