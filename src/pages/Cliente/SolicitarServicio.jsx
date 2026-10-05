import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCitaCliente } from '../../services/api';

const SolicitarServicio = () => {
  const [formData, setFormData] = useState({
    tipoEquipo: '',
    tipoServicio: '',
    modelo: '',
    descripcion: '',
    fechaPreferida: '',
    comprarEquipo: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createCitaCliente(formData);
      
      // Mostrar alerta de confirmación
      alert(response.message);
      
      // Redirigir a Mis Citas
      navigate('/cliente/estatus-cita');
    } catch (err) {
      setError(err.message || 'Error al crear la solicitud de servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Solicitar Servicio</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Equipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Equipo
            </label>
            <select
              name="tipoEquipo"
              value={formData.tipoEquipo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="">Selecciona el tipo de equipo</option>
              <option value="Split">Split</option>
              <option value="Ventana">Ventana</option>
              <option value="Piso Techo">Piso Techo</option>
              <option value="Central">Central</option>
              <option value="Refrigerador / Nevera">Refrigerador / Nevera</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Tipo de Servicio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Servicio
            </label>
            <select
              name="tipoServicio"
              value={formData.tipoServicio}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="">Selecciona el tipo de servicio</option>
              <option value="Mantenimiento Preventivo">Mantenimiento Preventivo ($35.00)</option>
              <option value="Instalación de Equipo">Instalación de Equipo ($45.00)</option>
              <option value="Desinstalación de Equipo">Desinstalación de Equipo ($20.00)</option>
              <option value="Mantenimiento Correctivo / Reparación">Mantenimiento Correctivo / Reparación (A evaluar en revisión)</option>
            </select>
          </div>

          {/* Compra de Equipo Nuevo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="comprarEquipo"
                checked={formData.comprarEquipo}
                onChange={(e) => setFormData({ ...formData, comprarEquipo: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">¿Deseas adquirir el equipo nuevo con nosotros?</span>
            </label>
            
            {formData.comprarEquipo && (
              <div className="mt-3 p-3 bg-white border border-blue-300 rounded-lg">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>Información importante:</strong> Un asesor de Maher Proyect evaluará tu requerimiento y te enviará la cotización del equipo + instalación a tu panel de servicios.
                </p>
              </div>
            )}
          </div>

          {/* Modelo / Marca */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Modelo / Marca
            </label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ej. Samsung, LG, Haier..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Descripción del Problema */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción del Problema / Servicio Solicitado
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe detalladamente el problema o el servicio que necesitas..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              required
            />
          </div>

          {/* Fecha Preferida */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Preferida de Atención
            </label>
            <input
              type="date"
              name="fechaPreferida"
              value={formData.fechaPreferida}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarServicio;