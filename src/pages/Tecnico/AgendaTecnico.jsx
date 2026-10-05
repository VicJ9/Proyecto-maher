import React, { useState, useEffect } from 'react';
import { getServiciosTecnico } from '../../services/api';
import { Calendar, MapPin, Phone, User, Wrench, CheckCircle, Clock, AlertCircle, ClipboardList } from 'lucide-react';

const MisServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [notasTecnico, setNotasTecnico] = useState('');
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [diagnostico, setDiagnostico] = useState({
    presionGas: '',
    amperaje: '',
    voltaje: '',
    tempEntrada: '',
    tempSalida: '',
    refrigerante: '',
    checklist: [],
    problemas: ''
  });

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServiciosTecnico();
        setServicios(data);
      } catch (err) {
        console.error('Error al cargar servicios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En Sitio':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Programado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleOpenModal = (servicio) => {
    setSelectedServicio(servicio);
    setNotasTecnico(servicio.notasTecnico || '');
    setInsumosSeleccionados(servicio.insumosUtilizados || []);
    setDiagnostico(servicio.diagnostico || {
      presionGas: '',
      amperaje: '',
      voltaje: '',
      tempEntrada: '',
      tempSalida: '',
      refrigerante: '',
      checklist: [],
      problemas: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedServicio(null);
    setNotasTecnico('');
    setInsumosSeleccionados([]);
    setDiagnostico({
      presionGas: '',
      amperaje: '',
      voltaje: '',
      tempEntrada: '',
      tempSalida: '',
      refrigerante: '',
      checklist: [],
      problemas: ''
    });
  };

  const handleUpdateStatus = async (nuevoEstatus) => {
    if (!selectedServicio) return;

    try {
      // Actualizar localmente primero
      const updatedServicios = servicios.map(s => 
        s.id === selectedServicio.id 
          ? { ...s, estatus: nuevoEstatus, notasTecnico, insumosUtilizados: insumosSeleccionados, diagnostico }
          : s
      );
      setServicios(updatedServicios);
      
      // Guardar en localStorage
      localStorage.setItem('maher_citas', JSON.stringify(updatedServicios));
      
      handleCloseModal();
      alert(`Estado actualizado a: ${nuevoEstatus}`);
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const toggleInsumo = (insumo) => {
    if (insumosSeleccionados.includes(insumo)) {
      setInsumosSeleccionados(insumosSeleccionados.filter(i => i !== insumo));
    } else {
      setInsumosSeleccionados([...insumosSeleccionados, insumo]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando servicios asignados...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Servicios Asignados</h1>

      {servicios.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes servicios asignados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{servicio.equipo}</h3>
                  <p className="text-sm text-gray-500">{servicio.servicio}</p>
                  {servicio.modelo && <p className="text-xs text-gray-400 mt-1">Modelo: {servicio.modelo}</p>}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(servicio.estatus)}`}
                >
                  {servicio.estatus}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Cliente: {servicio.cliente || 'Por asignar'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Dirección: {servicio.direccion || 'Por asignar'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Teléfono: {servicio.telefono || 'Por asignar'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Fecha: {servicio.fecha}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal(servicio)}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Wrench className="w-4 h-4" />
                Gestionar Servicio
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalle del Servicio */}
      {showModal && selectedServicio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Detalle del Servicio</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Información del Servicio */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">{selectedServicio.equipo} - {selectedServicio.servicio}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Cliente:</p>
                  <p className="font-medium text-gray-900">{selectedServicio.cliente || 'Por asignar'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Dirección:</p>
                  <p className="font-medium text-gray-900">{selectedServicio.direccion || 'Por asignar'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Teléfono:</p>
                  <p className="font-medium text-gray-900">{selectedServicio.telefono || 'Por asignar'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha:</p>
                  <p className="font-medium text-gray-900">{selectedServicio.fecha}</p>
                </div>
              </div>
            </div>

            {/* Cambio de Estatus */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Cambiar Estado</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleUpdateStatus('En Sitio')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  En Sitio
                </button>
                <button
                  onClick={() => handleUpdateStatus('En Proceso')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  En Proceso
                </button>
                <button
                  onClick={() => handleUpdateStatus('Completado')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Completado
                </button>
              </div>
            </div>

            {/* Insumos Utilizados */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Insumos Utilizados</h3>
              <div className="flex flex-wrap gap-2">
                {['Gas R-410A', 'Gas R-22', 'Capacitor 35uF', 'Capacitor 45uF', 'Termostato', 'Filtro Aire', 'Tubería Cobre'].map((insumo) => (
                  <button
                    key={insumo}
                    onClick={() => toggleInsumo(insumo)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      insumosSeleccionados.includes(insumo)
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {insumo}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnóstico Técnico Detallado */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Diagnóstico Técnico</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Presión de Gas (PSI)</label>
                  <input
                    type="number"
                    value={diagnostico?.presionGas || ''}
                    onChange={(e) => setDiagnostico({ ...diagnostico, presionGas: e.target.value })}
                    placeholder="Ej: 350"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amperaje (A)</label>
                  <input
                    type="number"
                    value={diagnostico?.amperaje || ''}
                    onChange={(e) => setDiagnostico({ ...diagnostico, amperaje: e.target.value })}
                    placeholder="Ej: 8.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voltaje (V)</label>
                  <input
                    type="number"
                    value={diagnostico?.voltaje || ''}
                    onChange={(e) => setDiagnostico({ ...diagnostico, voltaje: e.target.value })}
                    placeholder="Ej: 220"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temp. Entrada (°C)</label>
                  <input
                    type="number"
                    value={diagnostico?.tempEntrada || ''}
                    onChange={(e) => setDiagnostico({ ...diagnostico, tempEntrada: e.target.value })}
                    placeholder="Ej: 24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temp. Salida (°C)</label>
                  <input
                    type="number"
                    value={diagnostico?.tempSalida || ''}
                    onChange={(e) => setDiagnostico({ ...diagnostico, tempSalida: e.target.value })}
                    placeholder="Ej: 18"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Refrigerante</label>
                  <select
                    value={diagnostico?.refrigerante || ''}
                    onChange={(e) => setDiagnostico({ ...diagnostico, refrigerante: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="R-22">R-22</option>
                    <option value="R-410A">R-410A</option>
                    <option value="R-134A">R-134A</option>
                    <option value="R-404A">R-404A</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Checklist de Verificación</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Compresor', 'Evaporador', 'Condensador', 'Termostato', 'Válvulas', 'Filtros', 'Tubería', 'Eléctrico'].map((item) => (
                    <label key={item} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={diagnostico?.checklist?.includes(item) || false}
                        onChange={(e) => {
                          const newChecklist = diagnostico?.checklist || [];
                          if (e.target.checked) {
                            setDiagnostico({ ...diagnostico, checklist: [...newChecklist, item] });
                          } else {
                            setDiagnostico({ ...diagnostico, checklist: newChecklist.filter(i => i !== item) });
                          }
                        }}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Problemas Encontrados</label>
                <textarea
                  value={diagnostico?.problemas || ''}
                  onChange={(e) => setDiagnostico({ ...diagnostico, problemas: e.target.value })}
                  placeholder="Describe los problemas encontrados..."
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>

            {/* Notas del Técnico */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Notas del Técnico</h3>
              <textarea
                value={notasTecnico}
                onChange={(e) => setNotasTecnico(e.target.value)}
                placeholder="Ej: Se realizó limpieza profunda y cambio de capacitor..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedServicio.estatus)}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisServicios;