import React, { useState, useEffect } from 'react';
import { getCitasCliente, getTecnicos, asignarTecnico } from '../../services/api';
import { Calendar, MapPin, User, CheckCircle, Clock, AlertCircle, DollarSign, Send, UserCheck } from 'lucide-react';

const CitasAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // 'todas', 'pendientes', 'cotizar'
  const [showCotizarModal, setShowCotizarModal] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [montoCotizado, setMontoCotizado] = useState('');
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getCitasCliente();
        setCitas(data);
      } catch (err) {
        console.error('Error al cargar citas:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTecnicos = async () => {
      try {
        const data = await getTecnicos();
        setTecnicos(data);
      } catch (err) {
        console.error('Error al cargar técnicos:', err);
      }
    };

    fetchCitas();
    fetchTecnicos();
  }, []);

  const filteredCitas = citas.filter(cita => {
    if (filter === 'todas') return true;
    if (filter === 'cotizar') return cita.estatus === 'Pendiente por Cotizar';
    if (filter === 'pendientes') return cita.estatus === 'Pendiente';
    return true;
  });

  const handleOpenCotizarModal = (cita) => {
    setSelectedCita(cita);
    setMontoCotizado(cita.montoCotizado || '');
    setShowCotizarModal(true);
  };

  const handleCloseCotizarModal = () => {
    setShowCotizarModal(false);
    setSelectedCita(null);
    setMontoCotizado('');
  };

  const handleEnviarCotizacion = () => {
    if (!montoCotizado || !selectedCita) return;

    // Actualizar la cita con la cotización
    const updatedCitas = citas.map(cita => {
      if (cita.id === selectedCita.id) {
        return {
          ...cita,
          montoCotizado: montoCotizado,
          estatus: 'Cotizado',
          cotizacionEnviada: true
        };
      }
      return cita;
    });

    setCitas(updatedCitas);
    
    // Guardar en localStorage
    localStorage.setItem('maher_citas', JSON.stringify(updatedCitas));

    handleCloseCotizarModal();
    alert('Cotización enviada exitosamente al cliente');
  };

  const handleOpenAsignarModal = (cita) => {
    setSelectedCita(cita);
    setTecnicoSeleccionado(cita.tecnicoAsignado || '');
    setShowAsignarModal(true);
  };

  const handleCloseAsignarModal = () => {
    setShowAsignarModal(false);
    setSelectedCita(null);
    setTecnicoSeleccionado('');
  };

  const handleAsignarTecnico = async () => {
    if (!tecnicoSeleccionado || !selectedCita) return;

    try {
      await asignarTecnico(selectedCita.id, tecnicoSeleccionado);
      
      // Actualizar localmente
      const updatedCitas = citas.map(cita => {
        if (cita.id === selectedCita.id) {
          return { ...cita, tecnicoAsignado: tecnicoSeleccionado };
        }
        return cita;
      });
      
      setCitas(updatedCitas);
      handleCloseAsignarModal();
      alert('Técnico asignado exitosamente');
    } catch (err) {
      alert('Error al asignar técnico');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Programado':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pago Verificado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pendiente por Cotizar':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cotizado':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Pago Parcial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle className="w-4 h-4" />;
      case 'En progreso':
        return <Clock className="w-4 h-4" />;
      case 'Pendiente':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Citas</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('todas')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'todas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('pendientes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pendientes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter('cotizar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'cotizar'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Por Cotizar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estatus
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monto Cotizado
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCitas.map((cita) => (
                <tr key={cita.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    #{cita.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{cita.equipo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {cita.servicio}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cita.modelo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {cita.fecha}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{cita.tecnicoAsignado || 'Sin asignar'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cita.estatus)}`}>
                      {getStatusIcon(cita.estatus)}
                      {cita.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cita.montoCotizado ? `$${cita.montoCotizado}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!cita.tecnicoAsignado && (
                        <button
                          onClick={() => handleOpenAsignarModal(cita)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          title="Asignar Técnico"
                        >
                          <UserCheck className="w-4 h-4" />
                          Asignar
                        </button>
                      )}
                      {cita.estatus === 'Pendiente por Cotizar' && (
                        <button
                          onClick={() => handleOpenCotizarModal(cita)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                          title="Cotizar"
                        >
                          <DollarSign className="w-4 h-4" />
                          Cotizar
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

      {/* Modal de Cotización */}
      {showCotizarModal && selectedCita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Enviar Cotización</h2>
              <button
                onClick={handleCloseCotizarModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Cliente Solicita:</p>
                <p className="font-semibold text-gray-900">{selectedCita.equipo} - {selectedCita.modelo}</p>
                <p className="text-sm text-gray-600 mt-2">Servicio: {selectedCita.servicio}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto Cotizado (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={montoCotizado}
                    onChange={(e) => setMontoCotizado(e.target.value)}
                    placeholder="Ej: 350.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Este monto incluye el equipo + instalación</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseCotizarModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarCotizacion}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Cotización
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Asignar Técnico */}
      {showAsignarModal && selectedCita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Asignar Técnico</h2>
              <button
                onClick={handleCloseAsignarModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Servicio:</p>
                <p className="font-semibold text-gray-900">{selectedCita.equipo} - {selectedCita.modelo}</p>
                <p className="text-sm text-gray-600 mt-2">Cliente: {selectedCita.cliente}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seleccionar Técnico
                </label>
                <select
                  value={tecnicoSeleccionado}
                  onChange={(e) => setTecnicoSeleccionado(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un técnico</option>
                  {tecnicos.map((tecnico) => (
                    <option key={tecnico.id} value={tecnico.email}>
                      {tecnico.nombre} ({tecnico.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseAsignarModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAsignarTecnico}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitasAdmin;