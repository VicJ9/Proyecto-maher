import React, { useState, useEffect } from 'react';
import { getFacturasCliente } from '../../services/api';
import { FileText, Download, Plus, Search, Eye, Printer, Trash2 } from 'lucide-react';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await getFacturasCliente();
        setFacturas(data);
      } catch (err) {
        console.error('Error al cargar facturas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = 
      factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.concepto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todas' || factura.estatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En Verificación':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pago Parcial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetail = (factura) => {
    setSelectedFactura(factura);
    setShowDetailModal(true);
  };

  const handlePrintInvoice = (factura) => {
    // Implementar impresión (placeholder)
    alert(`Imprimiendo factura ${factura.id}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Facturas</h1>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar facturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todas">Todos los estatus</option>
          <option value="Pagada">Pagadas</option>
          <option value="Pendiente">Pendientes</option>
          <option value="En Verificación">En Verificación</option>
          <option value="Rechazado">Rechazadas</option>
          <option value="Pago Parcial">Pago Parcial</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                  Concepto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estatus
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFacturas.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {factura.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {factura.fecha}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {factura.concepto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    {factura.monto}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {factura.metodoPago || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(factura.estatus)}`}>
                      {factura.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(factura)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(factura)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {showDetailModal && selectedFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Detalle de Factura</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">N° Factura:</p>
                    <p className="font-semibold text-gray-900">{selectedFactura.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha:</p>
                    <p className="font-semibold text-gray-900">{selectedFactura.fecha}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Concepto:</p>
                    <p className="font-semibold text-gray-900">{selectedFactura.concepto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto:</p>
                    <p className="font-semibold text-gray-900">{selectedFactura.monto}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Información de Pago</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Método:</p>
                    <p className="font-medium text-gray-900">{selectedFactura.metodoPago || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Banco Origen:</p>
                    <p className="font-medium text-gray-900">{selectedFactura.bancoOrigen || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Referencia:</p>
                    <p className="font-medium text-gray-900">{selectedFactura.referencia || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha Pago:</p>
                    <p className="font-medium text-gray-900">{selectedFactura.fechaPago || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedFactura.montoReportado && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Detalles de Monto</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Monto Factura:</p>
                      <p className="font-medium text-gray-900">{selectedFactura.montoFactura || selectedFactura.monto}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monto Reportado:</p>
                      <p className="font-medium text-gray-900">{selectedFactura.montoReportado}</p>
                    </div>
                  </div>
                  {selectedFactura.saldoFavor && (
                    <div className="mt-2 p-2 bg-yellow-100 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Saldo a favor: {selectedFactura.saldoFavor}
                      </p>
                    </div>
                  )}
                  {selectedFactura.deudaRestante && (
                    <div className="mt-2 p-2 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800">
                        Deuda restante: {selectedFactura.deudaRestante}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedFactura.razonRechazo && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Motivo de Rechazo</h3>
                  <p className="text-sm text-red-800">{selectedFactura.razonRechazo}</p>
                </div>
              )}

              {selectedFactura.nota && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Notas</h3>
                  <p className="text-sm text-blue-800">{selectedFactura.nota}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => handlePrintInvoice(selectedFactura)}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facturas;