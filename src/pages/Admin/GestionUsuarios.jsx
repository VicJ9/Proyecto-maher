import React, { useState, useEffect } from 'react';
import { getTecnicos } from '../../services/api';
import { User, UserPlus, Trash2, Edit, Shield, Mail, Phone, Calendar, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

const GestionUsuarios = () => {
  const [activeTab, setActiveTab] = useState('tecnicos'); // 'tecnicos' or 'admins'
  const [loading, setLoading] = useState(true);
  const [tecnicos, setTecnicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    cedula: '',
    direccion: '',
    role: 'tecnico'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tecData = await getTecnicos();
        setTecnicos(tecData);

        // Obtener administradores directamente de localStorage (usuarios con rol admin)
        const users = JSON.parse(localStorage.getItem('maher_users')) || [];
        const adminsData = users.filter(user => user.role === 'admin');
        setClientes(adminsData);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      cedula: '',
      direccion: '',
      role: activeTab === 'tecnicos' ? 'tecnico' : 'cliente'
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      cedula: '',
      direccion: '',
      role: activeTab === 'tecnicos' ? 'tecnico' : 'cliente'
    });
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      password: '',
      telefono: user.telefono || '',
      cedula: user.cedula || '',
      direccion: user.direccion || '',
      role: user.role || (activeTab === 'tecnicos' ? 'tecnico' : 'cliente')
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      cedula: '',
      direccion: '',
      role: activeTab === 'tecnicos' ? 'tecnico' : 'cliente'
    });
  };

  const handleAddUser = () => {
    if (!formData.nombre || !formData.email || (activeTab === 'tecnicos' && !formData.password)) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    // Asignar rol explícitamente según la pestaña activa
    const assignedRole = activeTab === 'tecnicos' ? 'tecnico' : 'admin';

    const newUser = {
      id: Date.now(),
      ...formData,
      role: assignedRole
    };

    if (activeTab === 'tecnicos') {
      setTecnicos([...tecnicos, newUser]);
    } else {
      setClientes([...clientes, newUser]);
    }

    // Guardar en localStorage
    const users = JSON.parse(localStorage.getItem('maher_users')) || [];
    users.push(newUser);
    localStorage.setItem('maher_users', JSON.stringify(users));

    handleCloseAddModal();
    alert('Usuario agregado exitosamente');
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    // Actualizar en localStorage
    const users = JSON.parse(localStorage.getItem('maher_users')) || [];
    const updatedUsers = users.map(user => {
      if (activeTab === 'tecnicos' && user.id === selectedUser.id) {
        return { ...user, ...formData };
      }
      if (activeTab === 'clientes' && user.email === selectedUser.email) {
        return { ...user, ...formData };
      }
      return user;
    });
    localStorage.setItem('maher_users', JSON.stringify(updatedUsers));

    // Actualizar estado local
    if (activeTab === 'tecnicos') {
      const updatedTecnicos = tecnicos.map(t =>
        t.id === selectedUser.id ? { ...t, ...formData } : t
      );
      setTecnicos(updatedTecnicos);
    } else {
      const updatedAdmins = clientes.map(c =>
        c.email === selectedUser.email ? { ...c, ...formData } : c
      );
      setClientes(updatedAdmins);
    }

    handleCloseEditModal();
    alert('Usuario actualizado exitosamente');
  };

  const handleDeleteUser = (user) => {
    if (!confirm(`¿Estás seguro de eliminar a ${user.nombre}?`)) return;

    // Eliminar de localStorage
    const users = JSON.parse(localStorage.getItem('maher_users')) || [];
    const updatedUsers = users.filter(u => {
      if (activeTab === 'tecnicos') {
        return u.id !== user.id;
      }
      if (activeTab === 'clientes') {
        return u.email !== user.email;
      }
      return true;
    });
    localStorage.setItem('maher_users', JSON.stringify(updatedUsers));

    // Actualizar estado local
    if (activeTab === 'tecnicos') {
      setTecnicos(tecnicos.filter(t => t.id !== user.id));
    } else {
      setClientes(clientes.filter(c => c.email !== user.email));
    }

    alert('Usuario eliminado exitosamente');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tecnicos')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tecnicos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Técnicos
        </button>
        <button
          onClick={() => setActiveTab('clientes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'clientes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Administradores
        </button>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Agregar {activeTab === 'tecnicos' ? 'Técnico' : 'Administrador'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {activeTab === 'tecnicos' ? 'ID' : 'Email'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cédula/RIF
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(activeTab === 'tecnicos' ? tecnicos : clientes).map((user, index) => (
                <tr key={activeTab === 'tecnicos' ? user.id : `cliente-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.id || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{user.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.telefono || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.cedula || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.direccion || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Agregar/Editar */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {showAddModal ? 'Agregar' : 'Editar'} {activeTab === 'tecnicos' ? 'Técnico' : 'Cliente'}
              </h2>
              <button
                onClick={showAddModal ? handleCloseAddModal : handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: usuario@empresa.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={showEditModal}
                />
              </div>

              {showAddModal && activeTab === 'tecnicos' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="•••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: 0414-123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cédula/RIF
                </label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  placeholder="Ej: 20.123.456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ej: Av. Principal #123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={showAddModal ? handleCloseAddModal : handleCloseEditModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={showAddModal ? handleAddUser : handleEditUser}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {showAddModal ? 'Agregar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
