import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  const styles = {
    body: {
      background: 'linear-gradient(135deg, #1C252C 30%, #0A3663 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box',
      width: '100%'
    },
    loginBox: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '420px',
      padding: '40px 35px',
      borderTop: '4px solid #00A8E8',
      boxSizing: 'border-box',
      border: 'none',
      outline: 'none'
    },
    brandHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      color: '#0A3663',
      fontSize: '28px',
      fontWeight: '800',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      margin: '0 0 8px 0'
    },
    spanCyan: {
      color: '#00A8E8'
    },
    subtitle: {
      color: '#6A7B83',
      fontSize: '14px',
      marginTop: '8px',
      fontWeight: '500',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginBox}>
        <div style={styles.brandHeader}>
          <h1 style={styles.title}>
            MAHER <span style={styles.spanCyan}>PROYECT</span>
          </h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;