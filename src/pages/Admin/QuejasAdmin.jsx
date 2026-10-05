import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Filter } from 'lucide-react';

const QuejasAdmin = () => {
  const [quejas, setQuejas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todas');
  const [filterPrioridad, setFilterPrioridad] = useState('todas');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQueja, setSelectedQueja] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    const fetchQuejas = () => {
      const quejasData = JSON.parse(localStorage.getItem('maher_quejas')) || [];
      setQuejas(quejasData);
      setLoading(false);
    };

    fetchQuejas();
  }, []);

  const filteredQuejas = quejas.filter(queja => {
    const matchesStatus = filterStatus === 'todas' || queja.estatus === filterStatus;
    const matchesPrioridad = filterPrioridad === 'todas' || queja.prioridad === filterPrioridad;
    return matchesStatus && matchesPrioridad;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resuelto':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetail = (queja) => {
    setSelectedQueja(queja);
    setRespuesta(queja.respuesta || '');
    setShowDetailModal(true);
  };

  const handleResolverQueja = () => {
    if (!respuesta || respuesta.length < 10) {
      alert('Por favor escribe una respuesta de al menos 10 caracteres');
      return;
    }

    const updatedQuejas = quejas.map(q => 
      q.id === selectedQueja.id 
        ? { ...q, estatus: 'Resuelto', respuesta }
        : q
    );

    setQuejas(updatedQuejas);
    localStorage.setItem('maher_quejas', JSON.stringify(updatedQuejas));
    
    setShowDetailModal(false);
    setSelectedQueja(null);
    setRespuesta('');
    alert('Queja resuelta exitosamente');
  };

  const handleRechazarQueja = () => {
    if (!confirm('¿Estás seguro de rechazar esta queja?')) return;

    const updatedQuejas = quejas.map(q => 
      q.id === selectedQueja.id 
        ? { ...q, estatus: 'Rechazado' }
        : q
    );

    setQuejas(updatedQuejas);
    localStorage.setItem('maher_quejas', JSON.stringify(updatedQuejas));
    
    setShowDetailModal(false);
    setSelectedQueja(null);
    setRespuesta('');
    alert('Queja rechazada');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando quejas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Quejas y Reclamos</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todos los estatus</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Resuelto">Resueltos</option>
            <option value="Rechazado">Rechazados</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterPrioridad}
            onChange={(e) => setFilterPrioridad(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Servicio Relacionado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Prioridad
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
              {filteredQuejas.map((queja) => (
                <tr key={queja.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    #{queja.id}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {queja.tipo}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {queja.servicioRelacionado || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {queja.userEmail}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {queja.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(queja.prioridad)}`}>
                      {queja.prioridad.charAt(0).toUpperCase() + queja.prioridad.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(queja.estatus)}`}>
                      {queja.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewDetail(queja)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {showDetailModal && selectedQueja && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Detalle de Queja</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tipo:</p>
                    <p className="font-semibold text-gray-900">{selectedQueja.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prioridad:</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedQueja.prioridad)}`}>
                      {selectedQueja.prioridad.charAt(0).toUpperCase() + selectedQueja.prioridad.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cliente:</p>
                    <p className="font-medium text-gray-900">{selectedQueja.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha:</p>
                    <p className="font-medium text-gray-900">{selectedQueja.fecha}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Servicio Relacionado:</p>
                <p className="font-medium text-gray-900">{selectedQueja.servicioRelacionado || 'N/A'}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Descripción del Problema:</p>
                <p className="text-gray-900">{selectedQueja.descripcion}</p>
              </div>

              {selectedQueja.estatus === 'Pendiente' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Respuesta del Administrador
                    </label>
                    <textarea
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      placeholder="Escribe tu respuesta al cliente..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRechazarQueja}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={handleResolverQueja}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Resolver
                    </button>
                  </div>
                </div>
              )}

              {selectedQueja.estatus === 'Resuelto' && selectedQueja.respuesta && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Respuesta Enviada</h3>
                  </div>
                  <p className="text-sm text-green-800">{selectedQueja.respuesta}</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuejasAdmin;