import React, { useState, useEffect } from 'react';
import { getFacturasCliente, reportarPagoFactura, getTasaBCV } from '../../services/api';
import { Download, FileText, X, CreditCard } from 'lucide-react';
import { jsPDF } from 'jspdf';

const MisFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [montoBs, setMontoBs] = useState(0);
  const [tasaBCV, setTasaBCV] = useState(36.50);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    moneda: '',
    metodo: '',
    bancoOrigen: '',
    cedulaOrigen: '',
    referencia: '',
    fechaPago: '',
    montoPagar: '',
    reciboFisico: ''
  });

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await getFacturasCliente();
        const userEmail = localStorage.getItem('maher_user_email');
        // Filtrar facturas solo del usuario actual
        const userFacturas = data.filter(factura => 
          !factura.clienteEmail || factura.clienteEmail === userEmail
        );
        setFacturas(userFacturas);
      } catch (err) {
        setError('Error al cargar las facturas');
      } finally {
        setLoading(false);
      }
    };

    const fetchTasaBCV = async () => {
      try {
        const tasa = await getTasaBCV();
        setTasaBCV(tasa);
      } catch (err) {
        console.error('Error al obtener tasa BCV:', err);
      }
    };

    fetchFacturas();
    fetchTasaBCV();
  }, []); // Se ejecuta solo al montar

  // Recargar facturas cuando el componente gana foco (cuando el usuario vuelve a la pestaña)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const reloadFacturas = async () => {
          try {
            const data = await getFacturasCliente();
            setFacturas(data);
          } catch (err) {
            console.error('Error al recargar facturas:', err);
          }
        };
        reloadFacturas();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getStatusColor = (estatus) => {
    if (estatus === 'Pagada') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (estatus === 'En Verificación') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (estatus === 'Rechazado') {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (estatus === 'Pago Parcial') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const handleOpenPaymentModal = (factura) => {
    setSelectedFactura(factura);
    // Calcular monto en Bolívares con la tasa BCV real
    const montoUSD = parseFloat(factura.monto.replace(/[$,]/g, ''));
    const montoCalculado = montoUSD * tasaBCV;
    setMontoBs(montoCalculado);
    setPaymentStep(1);
    // Limpiar datos del formulario para reintentar pago
    setPaymentData({
      moneda: '',
      metodo: '',
      bancoOrigen: '',
      referencia: '',
      fechaPago: '',
      montoPagar: montoUSD.toString(), // Pre-llenar con el valor numérico (sin $)
      reciboFisico: ''
    });
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedFactura(null);
    setMontoBs(0);
    setPaymentStep(1);
    setPaymentData({
      moneda: '',
      metodo: '',
      bancoOrigen: '',
      referencia: '',
      fechaPago: '',
      montoPagar: '',
      reciboFisico: ''
    });
  };

  const handleNextStep = () => {
    if (paymentStep === 1 && (!paymentData.moneda || !paymentData.metodo)) {
      alert('Por favor selecciona moneda y método de pago');
      return;
    }
    if (paymentStep === 2) {
      setPaymentStep(3);
    } else {
      setPaymentStep(paymentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setPaymentStep(paymentStep - 1);
  };

  const handleConfirmPayment = async () => {
    // Validaciones según el método de pago
    if (paymentData.metodo !== 'Efectivo') {
      if (!paymentData.bancoOrigen || !paymentData.referencia) {
        alert('Por favor completa los campos bancarios');
        return;
      }
    }

    if (!paymentData.fechaPago) {
      alert('Por favor indica la fecha del pago');
      return;
    }

    if (!paymentData.montoPagar) {
      alert('Por favor indica el monto a pagar');
      return;
    }

    try {
      await reportarPagoFactura(selectedFactura.id, paymentData);

      // Actualizar el estatus de la factura localmente
      setFacturas(facturas.map(factura =>
        factura.id === selectedFactura.id
          ? { ...factura, estatus: 'En Verificación' }
          : factura
      ));

      // Cerrar modal
      handleClosePaymentModal();
      alert('Pago reportado correctamente. En proceso de verificación.');
    } catch (err) {
      alert(err.message || 'Error al reportar el pago');
    }
  };

  const handleDownloadPDF = (factura) => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.text("MAHER PROYECT", 14, 20);
    doc.setFontSize(11);
    doc.text("Servicios de Climatización y Refrigeración", 14, 28);
    doc.line(14, 32, 196, 32);

    // Detalle de Factura
    doc.setFontSize(12);
    doc.text(`Factura N°: ${factura.id}`, 14, 45);
    doc.text(`Fecha: ${factura.fecha}`, 14, 53);
    doc.text(`Concepto: ${factura.concepto}`, 14, 61);
    doc.text(`Monto: ${factura.monto}`, 14, 69);
    doc.text(`Estatus: ${factura.estatus}`, 14, 77);

    // Estado del Pago / Notas
    doc.line(14, 85, 196, 85);
    doc.setFontSize(10);
    doc.text("Estado del Pago / Notas:", 14, 95);
    if (factura.razonRechazo) {
      doc.text(`Motivo: ${factura.razonRechazo}`, 14, 103);
    } else if (factura.nota) {
      doc.text(`Nota: ${factura.nota}`, 14, 103);
    } else {
      doc.text("Sin observaciones", 14, 103);
    }

    doc.line(14, 111, 196, 111);
    doc.setFontSize(10);
    doc.text("¡Gracias por confiar en Maher Proyect!", 14, 119);

    // Descargar PDF
    doc.save(`Factura_${factura.id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando tus facturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Facturas</h1>

      {facturas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No tienes facturas disponibles</p>
        </div>
      ) : (
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
                    Estatus
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {facturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{factura.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {factura.fecha}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {factura.concepto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      {factura.monto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(factura.estatus)}`}>
                        {factura.estatus}
                      </span>
                      {factura.estatus === 'Rechazado' && factura.razonRechazo && (
                        <div className="mt-2 text-xs text-red-600">
                          ⚠️ {factura.razonRechazo}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDownloadPDF(factura)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Descargar PDF
                        </button>
                        {(factura.estatus === 'Pendiente' || factura.estatus === 'Rechazado') && (
                          <button
                            onClick={() => handleOpenPaymentModal(factura)}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors ${
                              factura.estatus === 'Rechazado' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            <CreditCard className="w-4 h-4" />
                            {factura.estatus === 'Rechazado' ? 'Reintentar Pago' : 'Reportar Pago'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Pago - Estilo VNet */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Reportar Pago</h2>
              <button
                onClick={handleClosePaymentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Información de la factura */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Factura N°:</p>
              <p className="font-semibold text-gray-900">{selectedFactura?.id}</p>
              <p className="text-sm text-gray-600 mb-1 mt-2">Concepto:</p>
              <p className="font-semibold text-gray-900">{selectedFactura?.concepto}</p>
              <p className="text-sm text-gray-600 mb-1 mt-2">Monto a pagar:</p>
              <p className="font-bold text-2xl text-blue-600">{selectedFactura?.monto} USD</p>
              <p className="text-sm text-gray-600 mt-2">
                Equivalente en Bs: <span className="font-bold text-blue-600">{montoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.</span>
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-green-600">Tasa BCV oficial:</span> {tasaBCV.toFixed(2)} Bs. por USD
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center ${paymentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Método</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${paymentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${paymentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Datos</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${paymentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${paymentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Notificar</span>
              </div>
            </div>

            {/* Paso 1: Selección de Moneda / Método */}
            {paymentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    value={paymentData.moneda}
                    onChange={(e) => setPaymentData({ ...paymentData, moneda: e.target.value, metodo: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Selecciona la moneda</option>
                    <option value="VES">Bolívares (VES)</option>
                    <option value="USD">Dólares (USD)</option>
                  </select>
                </div>

                {paymentData.moneda === 'VES' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={paymentData.metodo}
                      onChange={(e) => setPaymentData({ ...paymentData, metodo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Selecciona el método</option>
                      <option value="Pago Móvil">Pago Móvil</option>
                      <option value="Transferencia">Transferencia Bancaria</option>
                      <option value="C2P">C2P</option>
                    </select>
                  </div>
                )}

                {paymentData.moneda === 'USD' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={paymentData.metodo}
                      onChange={(e) => setPaymentData({ ...paymentData, metodo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Selecciona el método</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Efectivo">Efectivo en Local</option>
                    </select>
                  </div>
                )}

                {/* Monto a transferir según método seleccionado */}
                {paymentData.moneda === 'VES' && paymentData.metodo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-1">Monto a transferir:</p>
                    <p className="font-bold text-2xl text-blue-600">
                      Bs. {montoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Tasa BCV: {tasaBCV.toFixed(2)} Bs./USD
                    </p>
                  </div>
                )}

                {paymentData.moneda === 'USD' && paymentData.metodo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 mb-1">Monto a transferir:</p>
                    <p className="font-bold text-2xl text-green-600">
                      {selectedFactura?.monto} USD
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Paso 2: Datos Destino */}
            {paymentStep === 2 && (
              <div className="space-y-4">
                {/* Monto destacado según método */}
                {paymentData.moneda === 'VES' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-1">Monto a transferir:</p>
                    <p className="font-bold text-2xl text-blue-600">
                      Bs. {montoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Tasa BCV: {tasaBCV.toFixed(2)} Bs./USD
                    </p>
                  </div>
                )}

                {paymentData.moneda === 'USD' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 mb-1">Monto a transferir:</p>
                    <p className="font-bold text-2xl text-green-600">
                      {selectedFactura?.monto} USD
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Datos de Pago - Maher Proyect</h3>
                  
                  {paymentData.metodo === 'Pago Móvil' && (
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Banco:</strong> Banesco</p>
                      <p><strong>RIF:</strong> J-12345678-0</p>
                      <p><strong>Teléfono:</strong> 0412-1234567</p>
                      <p><strong>C.I:</strong> 20.123.456</p>
                    </div>
                  )}

                  {paymentData.metodo === 'Transferencia' && (
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Banco:</strong> Banesco</p>
                      <p><strong>RIF:</strong> J-12345678-0</p>
                      <p><strong>Cuenta Corriente:</strong> 0134-0000-0000-0000-0000</p>
                      <p><strong>Tipo de Cuenta:</strong> Corriente</p>
                    </div>
                  )}

                  {paymentData.metodo === 'C2P' && (
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Banco:</strong> Banesco</p>
                      <p><strong>RIF:</strong> J-12345678-0</p>
                      <p><strong>Teléfono:</strong> 0412-1234567</p>
                    </div>
                  )}

                  {paymentData.metodo === 'Zelle' && (
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Email:</strong> pagos@maherproyect.com</p>
                      <p><strong>Nombre:</strong> Maher Proyect C.A.</p>
                    </div>
                  )}

                  {paymentData.metodo === 'Efectivo' && (
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Dirección:</strong> Av. Principal, Local 123</p>
                      <p><strong>Horario:</strong> Lunes a Viernes 9:00 AM - 6:00 PM</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePreviousStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Notificación del Pago */}
            {paymentStep === 3 && (
              <div className="space-y-4">
                {/* Nota especial para pagos en efectivo */}
                {paymentData.metodo === 'Efectivo' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      <strong>Información importante:</strong> El pago en efectivo se realiza directamente en la oficina o sede de Maher Proyect. Si ya realizaste el pago en caja, indica la fecha y/o número de recibo físico.
                    </p>
                  </div>
                )}

                {/* Solo mostrar campos bancarios si NO es efectivo */}
                {paymentData.metodo !== 'Efectivo' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Banco de Origen
                      </label>
                      <select
                        value={paymentData.bancoOrigen}
                        onChange={(e) => setPaymentData({ ...paymentData, bancoOrigen: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="">Selecciona el banco</option>
                        <option value="Banesco">Banesco</option>
                        <option value="Mercantil">Mercantil</option>
                        <option value="BDV">Banco de Venezuela</option>
                        <option value="Provincial">Provincial</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cédula del Titular de la Cuenta de Origen
                      </label>
                      <input
                        type="text"
                        value={paymentData.cedulaOrigen}
                        onChange={(e) => setPaymentData({ ...paymentData, cedulaOrigen: e.target.value })}
                        placeholder="Ej: 20.123.456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Referencia Bancaria
                      </label>
                      <input
                        type="text"
                        value={paymentData.referencia}
                        onChange={(e) => setPaymentData({ ...paymentData, referencia: e.target.value })}
                        placeholder="Ej: 1234567890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha del Pago
                  </label>
                  <input
                    type="date"
                    value={paymentData.fechaPago}
                    onChange={(e) => setPaymentData({ ...paymentData, fechaPago: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monto a Pagar
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentData.montoPagar}
                    onChange={(e) => setPaymentData({ ...paymentData, montoPagar: e.target.value })}
                    placeholder={paymentData.moneda === 'VES' 
                      ? montoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : selectedFactura?.monto.replace(/[$,]/g, '')
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  {/* Warning si el monto no coincide */}
                  {paymentData.montoPagar && selectedFactura && (
                    (() => {
                      const montoReportado = parseFloat(paymentData.montoPagar);
                      const montoEsperado = parseFloat(selectedFactura.monto.replace(/[$,]/g, ''));
                      const coincide = !isNaN(montoReportado) && !isNaN(montoEsperado) && montoReportado === montoEsperado;
                      
                      if (!coincide) {
                        return (
                          <p className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                            ⚠️ El monto reportado no coincide con el total de la factura.
                          </p>
                        );
                      }
                      return null;
                    })()
                  )}
                  {/* Monto esperado */}
                  <p className="mt-1 text-xs text-gray-500">
                    Monto esperado: {selectedFactura?.monto}
                  </p>
                </div>

                {/* Campo opcional de recibo físico para pagos en efectivo */}
                {paymentData.metodo === 'Efectivo' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      N° de Recibo / Comprobante Físico (Opcional)
                    </label>
                    <input
                      type="text"
                      value={paymentData.reciboFisico}
                      onChange={(e) => setPaymentData({ ...paymentData, reciboFisico: e.target.value })}
                      placeholder="Ej: REC-001234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handlePreviousStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Notificar Pago
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MisFacturas;