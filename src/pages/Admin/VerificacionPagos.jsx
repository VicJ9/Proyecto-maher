import React, { useState, useEffect } from 'react';
import { getFacturasCliente, aprobarPago, rechazarPago, aprobarPagoParcial } from '../../services/api';
import { CheckCircle, XCircle, AlertCircle, CreditCard, Banknote, Building2, Wallet } from 'lucide-react';

const VerificacionPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const data = await getFacturasCliente();
        // Filtrar solo pagos en "En Verificación"
        const pagosEnVerificacion = data.filter(factura => factura.estatus === 'En Verificación');
        setPagos(pagosEnVerificacion);
      } catch (err) {
        console.error('Error al cargar pagos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  const handleAprobar = async (facturaId) => {
    try {
      const response = await aprobarPago(facturaId);
      // Recargar la lista desde localStorage para reflejar cambios
      const data = await getFacturasCliente();
      const pagosEnVerificacion = data.filter(factura => factura.estatus === 'En Verificación');
      setPagos(pagosEnVerificacion);
      alert(response.message);
    } catch (err) {
      alert(err.message || 'Error al aprobar el pago');
    }
  };

  const handleAprobarParcial = async (facturaId) => {
    try {
      await aprobarPagoParcial(facturaId);
      // Recargar la lista desde localStorage para reflejar cambios
      const data = await getFacturasCliente();
      const pagosEnVerificacion = data.filter(factura => factura.estatus === 'En Verificación');
      setPagos(pagosEnVerificacion);
      alert('Pago parcial aprobado exitosamente');
    } catch (err) {
      alert(err.message || 'Error al aprobar el pago parcial');
    }
  };

  const handleOpenRejectModal = (pago) => {
    setSelectedPago(pago);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedPago(null);
    setRejectReason('');
  };

  const handleRechazar = async () => {
    if (!rejectReason || rejectReason.length < 5) {
      alert('Por favor indica la razón del rechazo (mínimo 5 caracteres)');
      return;
    }

    try {
      await rechazarPago(selectedPago.id, rejectReason);
      // Recargar la lista desde localStorage para reflejar cambios
      const data = await getFacturasCliente();
      const pagosEnVerificacion = data.filter(factura => factura.estatus === 'En Verificación');
      setPagos(pagosEnVerificacion);
      handleCloseRejectModal();
      alert('Pago rechazado exitosamente');
    } catch (err) {
      alert(err.message || 'Error al rechazar el pago');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando pagos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Verificación de Pagos</h1>

      {pagos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay pagos pendientes de verificación</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente / Servicio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Método de Pago
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Referencia / Cédula
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Cliente Test</p>
                          <p className="text-sm text-gray-600">{pago.concepto}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{pago.montoFactura || pago.monto} USD</p>
                        <p className="text-sm text-gray-500">Reportado: {pago.montoReportado || pago.monto}</p>
                        {pago.montoFactura && pago.montoReportado && (
                          (() => {
                            const montoFactura = parseFloat(pago.montoFactura.replace(/[$,]/g, ''));
                            const montoReportado = parseFloat(pago.montoReportado.replace(/[$,]/g, ''));
                            const diferencia = montoReportado - montoFactura;
                            
                            if (diferencia > 0) {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mt-1">
                                  ⚠️ Sobrante: +${diferencia.toFixed(2)} USD
                                </span>
                              );
                            } else if (diferencia < 0) {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full mt-1">
                                  ⚠️ Incompleto: ${diferencia.toFixed(2)} USD
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mt-1">
                                  ✅ Coincide
                                </span>
                              );
                            }
                          })()
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{pago.metodoPago || 'Pago Móvil'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{pago.referencia || '---'}</p>
                        <p className="text-sm text-gray-500">Cédula: {pago.cedulaOrigen || '---'}</p>
                        <p className="text-sm text-gray-500">{pago.bancoOrigen || '---'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {pago.fechaPago || pago.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAprobar(pago.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          title="Aprobar Pago"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar
                        </button>
                        {/* Botón de pago parcial solo si hay pago incompleto */}
                        {(() => {
                          const montoFactura = parseFloat((pago.montoFactura || pago.monto).replace(/[$,]/g, ''));
                          const montoReportado = parseFloat((pago.montoReportado || pago.monto).replace(/[$,]/g, ''));
                          const diferencia = montoReportado - montoFactura;
                          
                          if (diferencia < 0) {
                            return (
                              <button
                                onClick={() => handleAprobarParcial(pago.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                title="Aprobar como Pago Parcial"
                              >
                                <Wallet className="w-4 h-4" />
                                Parcial
                              </button>
                            );
                          }
                          return null;
                        })()}
                        <button
                          onClick={() => handleOpenRejectModal(pago)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          title="Rechazar Pago"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Rechazar Pago</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Factura: <span className="font-semibold">{selectedPago?.id}</span>
              </p>
              <p className="text-sm text-gray-600">
                Monto Factura: <span className="font-semibold">{selectedPago?.montoFactura || selectedPago?.monto}</span>
              </p>
              <p className="text-sm text-gray-600">
                Monto Reportado: <span className="font-semibold">{selectedPago?.montoReportado || selectedPago?.monto}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Razón del rechazo
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej: Referencia no encontrada en la cuenta bancaria, Captura falsa..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                Nota: Solo use esta opción cuando el pago NO aparece en la cuenta bancaria (referencia no encontrada o captura falsa).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseRejectModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Rechazar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificacionPagos;

