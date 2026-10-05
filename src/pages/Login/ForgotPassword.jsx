import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recoverPassword } from '../../services/api';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/InputField';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await recoverPassword(formData.email);
      setIsSubmitted(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al enviar instrucciones');
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
    },
    successContainer: {
      textAlign: 'center',
      padding: '20px 0'
    },
    successIconWrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      backgroundColor: '#E6F6FF',
      borderRadius: '50%',
      marginBottom: '16px'
    }
  };

  return (
    <AuthLayout subtitle="Recuperar Contraseña • Gestión de Soporte y Proyectos">
      {!isSubmitted ? (
        <>
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

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1C252C', marginBottom: '8px' }}>
              ¿Olvidó su contraseña de acceso?
            </h2>
            <p style={{ color: '#6A7B83', fontSize: '14px', lineHeight: '1.5' }}>
              Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <InputField
              label="CORREO ELECTRÓNICO"
              type="email"
              placeholder="ejemplo@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              {loading ? 'Enviando...' : 'ENVIAR INSTRUCCIONES'}
            </button>
          </form>

          {/* Enlace de Retorno */}
          <div style={styles.boxLinks}>
            <p style={styles.linkP}>
              <Link to="/" style={styles.linkA}>Volver al login</Link>
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
        </>
      ) : (
        /* Vista de Éxito al Enviar */
        <div style={styles.successContainer}>
          <div style={styles.successIconWrapper}>
            <span style={{ fontSize: '40px', color: '#107C41' }}>✓</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1C252C', marginBottom: '8px' }}>
            ¡Correo Enviado!
          </h2>
          <p style={{ color: '#6A7B83', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
            Hemos enviado instrucciones para restablecer su contraseña a <strong>{formData.email}</strong>
          </p>
          <p style={{ color: '#A0AEC0', fontSize: '13px' }}>
            Redirigiendo al login...
          </p>

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
        </div>
      )}
    </AuthLayout>
  );
}