import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, X } from 'lucide-react';

const CrearQueja = () => {
  const [formData, setFormData] = useState({
    tipo: '',
    servicioRelacionado: '',
    descripcion: '',
    prioridad: 'media'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

    if (!formData.tipo || !formData.descripcion) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      // Simular envío de queja
      const nuevaQueja = {
        id: Date.now(),
        ...formData,
        fecha: new Date().toISOString().split('T')[0],
        estatus: 'Pendiente',
        userEmail: localStorage.getItem('maher_user_email')
      };

      // Guardar en localStorage
      const quejas = JSON.parse(localStorage.getItem('maher_quejas')) || [];
      quejas.push(nuevaQueja);
      localStorage.setItem('maher_quejas', JSON.stringify(quejas));

      setSuccess(true);
      setTimeout(() => {
        navigate('/cliente/estatus-cita');
      }, 2000);
    } catch (err) {
      setError('Error al enviar la queja');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Queja Enviada!</h2>
          <p className="text-gray-600">Te contactaremos pronto para resolver tu inquietud.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear Queja / Reclamo</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Queja */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Queja *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="">Selecciona el tipo de queja</option>
              <option value="Servicio">Servicio</option>
              <option value="Facturación">Facturación</option>
              <option value="Calidad">Calidad del Trabajo</option>
              <option value="Tiempo de Espera">Tiempo de Espera</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Servicio Relacionado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Servicio Relacionado (opcional)
            </label>
            <input
              type="text"
              name="servicioRelacionado"
              value={formData.servicioRelacionado}
              onChange={handleChange}
              placeholder="Ej: Mantenimiento Aire Split - FAC-001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción del Problema *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe detalladamente el problema o situación..."
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              required
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Enviando...' : (
              <>
                <Send className="w-5 h-5" />
                Enviar Queja
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearQueja;