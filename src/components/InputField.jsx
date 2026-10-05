import React from 'react';

const InputField = ({ label, type, placeholder, value, onChange, required, minLength, name, checked }) => {
  const styles = {
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#1C252C',
      fontWeight: '700',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #E2E8F0',
      borderRadius: '8px',
      fontSize: '15px',
      color: '#1C252C',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease'
    }
  };

  if (type === 'checkbox') {
    return (
      <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <input 
          type="checkbox" 
          id={name}
          name={name}
          style={{ marginTop: '3px' }} 
          checked={checked}
          onChange={onChange}
          required 
          onInvalid={(e) => e.target.setCustomValidity('Selecciona esta casilla de verificación si quieres continuar')} 
          onInput={(e) => e.target.setCustomValidity('')}
        />
        <label htmlFor={name} style={{ fontSize: '13.5px', color: '#1C252C', lineHeight: '1.4' }}>
          {label}
        </label>
      </div>
    );
  }

  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <input 
        type={type} 
        style={styles.input} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        name={name}
      />
    </div>
  );
};

export default InputField;