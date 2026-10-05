import React, { useState, useEffect } from 'react';
import { getCitasCliente, aceptarCotizacion } from '../../services/api';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';

const EstatusCita = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getCitasCliente();
        const userEmail = localStorage.getItem('maher_user_email');
        // Filtrar citas solo del usuario actual
        const userCitas = data.filter(cita => 
          !cita.clienteEmail || cita.clienteEmail === userEmail
        );
        setCitas(userCitas);
      } catch (err) {
        setError('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const getBadgeColor = (estatus) => {
    switch (estatus) {
      case 'En progreso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Programado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente por Cotizar':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cotizado':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Pago Verificado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pago Parcial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAceptarCotizacion = async (citaId) => {
    try {
      await aceptarCotizacion(citaId);
      // Recargar citas
      const data = await getCitasCliente();
      setCitas(data);
      alert('Cotización aceptada. Factura generada. Procede al pago desde Mis Facturas.');
    } catch (err) {
      alert(err.message || 'Error al aceptar la cotización');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando tus citas...</p>
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Citas</h1>

      {citas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No tienes citas programadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{cita.equipo}</h3>
                  <p className="text-sm text-gray-500">{cita.servicio}</p>
                  {cita.modelo && <p className="text-xs text-gray-400 mt-1">Modelo: {cita.modelo}</p>}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(cita.estatus)}`}
                >
                  {cita.estatus}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                {cita.fecha}
              </div>

              {/* Mostrar cotización si existe */}
              {cita.montoCotizado && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-900">Cotización:</span>
                    </div>
                    <span className="font-bold text-indigo-900">${cita.montoCotizado} USD</span>
                  </div>
                </div>
              )}

              {/* Botón para aceptar cotización */}
              {cita.estatus === 'Cotizado' && (
                <button
                  onClick={() => handleAceptarCotizacion(cita.id)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aceptar Cotización
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstatusCita;