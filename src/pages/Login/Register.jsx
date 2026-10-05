import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: '', email: '', phone: '', cedula: '', direccion: '', password: '', terms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      
      // Guardar usuario en localStorage y auto-login
      localStorage.setItem('maher_user_email', response.user.email);
      localStorage.setItem('maher_user_name', response.user.nombre || formData.fullname);
      localStorage.setItem('maher_user_role', response.user.role);
      localStorage.setItem('maher_user_token', response.user.token);
      
      // Redirigir al panel del cliente
      navigate('/cliente/estatus-cita');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    btn: {
      width: '100%',
      backgroundColor: '#0A3663',
      color: 'white',
      border: 'none',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      marginTop: '8px',
      boxShadow: '0 4px 6px rgba(10, 54, 99, 0.2)',
      transition: 'all 0.3s ease'
    },
    boxLinks: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '14px'
    },
    linkP: {
      marginBottom: '12px',
      color: '#51636F',
      margin: '0 0 12px 0'
    },
    linkA: {
      color: '#00A8E8',
      textDecoration: 'none',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <AuthLayout subtitle="Registro de Cliente • Gestión de Soporte y Proyectos">
      {/* Error message */}
      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#991B1B',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="NOMBRE COMPLETO"
          type="text"
          placeholder="Ej. Juan Pérez"
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          required
        />
        <InputField
          label="CORREO ELECTRÓNICO"
          type="email"
          placeholder="ejemplo@empresa.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <InputField
          label="TELÉFONO"
          type="tel"
          placeholder="+52 123 456 7890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <InputField
          label="CÉDULA / RIF"
          type="text"
          placeholder="Ej. V-12345678 o J-12345678-0"
          value={formData.cedula}
          onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
          required
        />
        <InputField
          label="DIRECCIÓN"
          type="text"
          placeholder="Ej. Av. Principal, Calle 123, Casa 45"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          required
        />
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '700',
            color: '#51636F',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            CONTRASEÑA
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              minLength="8"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px 50px 14px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6B7280',
                padding: '0'
              }}
            >
              {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>
        </div>
        
        <InputField
          type="checkbox"
          label="Acepto los términos y condiciones y la política de privacidad"
          name="reg-terms"
          checked={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
          required
        />

        <button 
          type="submit" 
          style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'CREAR CUENTA'}
        </button>
      </form>

      <div style={styles.boxLinks}>
        <p style={styles.linkP}>
          ¿Ya tiene cuenta? <Link to="/" style={styles.linkA}>Volver al login</Link>
        </p>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        paddingTop: '20px',
        borderTop: '1px solid #E2E8F0'
      }}>
        <p style={{
          color: '#6A7B83',
          fontSize: '12px',
          fontWeight: '500',
          margin: '0'
        }}>
          © 2024 Maher Proyect. Todos los derechos reservados.
        </p>
      </div>
    </AuthLayout>
  );
}