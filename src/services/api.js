// API service file - simulated backend responses

export const getTasaBCV = async () => {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    const data = await response.json();
    console.log('Respuesta API BCV:', data);
    // La API de dolarapi devuelve un objeto con propiedades específicas
    if (data && data.valor_promedio) {
      return parseFloat(data.valor_promedio);
    }
    if (data && data.promedio) {
      return parseFloat(data.promedio);
    }
    if (data && data.precio) {
      return parseFloat(data.precio);
    }
    return 36.50; // Valor de respaldo
  } catch (error) {
    console.error("Error al obtener la tasa BCV:", error);
    return 36.50; // Valor de respaldo
  }
};

// Inicializar datos desde localStorage o usar valores por defecto
const defaultUsers = [
  {
    id: 1,
    email: 'admin@empresa.com',
    password: 'admin123',
    role: 'admin',
    nombre: 'Administrador'
  },
  {
    id: 2,
    email: 'cliente@empresa.com',
    password: 'cliente123',
    role: 'cliente',
    nombre: 'Cliente Test',
    cedula: '20.123.456',
    telefono: '0414-123-4567',
    direccion: 'Av. Principal #123'
  },
  {
    id: 3,
    email: 'tecnico@empresa.com',
    password: 'tecnico123',
    role: 'tecnico',
    nombre: 'Técnico Test'
  },
  {
    id: 4,
    email: 'tecnico2@empresa.com',
    password: 'tecnico123',
    role: 'tecnico',
    nombre: 'Técnico 2'
  }
];

const defaultInventario = [
  { id: 1, nombre: 'Compresor 12000 BTU', categoria: 'Compresores', stock: 15, stockMin: 5, precio: '$120.00' },
  { id: 2, nombre: 'Compresor 18000 BTU', categoria: 'Compresores', stock: 8, stockMin: 5, precio: '$180.00' },
  { id: 3, nombre: 'Gas R-410A (12kg)', categoria: 'Gases', stock: 25, stockMin: 10, precio: '$85.00' },
  { id: 4, nombre: 'Gas R-22 (12kg)', categoria: 'Gases', stock: 3, stockMin: 10, precio: '$75.00' },
  { id: 5, nombre: 'Capacitor 35uF', categoria: 'Eléctricos', stock: 50, stockMin: 20, precio: '$12.00' },
  { id: 6, nombre: 'Capacitor 45uF', categoria: 'Eléctricos', stock: 42, stockMin: 20, precio: '$15.00' },
  { id: 7, nombre: 'Termostato Digital', categoria: 'Controles', stock: 20, stockMin: 10, precio: '$35.00' },
  { id: 8, nombre: 'Filtro de Aire 16x20', categoria: 'Filtros', stock: 100, stockMin: 30, precio: '$8.00' },
  { id: 9, nombre: 'Tubería Cobre 1/4"', categoria: 'Tuberías', stock: 60, stockMin: 25, precio: '$22.00' },
  { id: 10, nombre: 'Tubería Cobre 3/8"', categoria: 'Tuberías', stock: 55, stockMin: 25, precio: '$28.00' },
];

const defaultCitas = [
  {
    id: 1,
    equipo: 'Aire Split 12000 BTU',
    servicio: 'Mantenimiento preventivo',
    modelo: 'Samsung',
    descripcion: 'Mantenimiento periódico',
    estatus: 'En progreso',
    fecha: '2026-10-01',
    comprarEquipo: false,
    montoCotizado: null,
    cotizacionEnviada: false,
    cliente: 'María Pérez',
    clienteEmail: 'cliente@empresa.com',
    direccion: 'Av. Principal #123',
    telefono: '0414-123-4567',
    notasTecnico: '',
    insumosUtilizados: [],
    tecnicoAsignado: 'tecnico@empresa.com'
  },
  {
    id: 2,
    equipo: 'Consola Piso Techo 3 Ton',
    servicio: 'Recarga de gas',
    modelo: 'LG',
    descripcion: 'Recarga de gas refrigerante',
    estatus: 'Pendiente',
    fecha: '2026-10-05',
    comprarEquipo: false,
    montoCotizado: null,
    cotizacionEnviada: false,
    cliente: 'Juan García',
    clienteEmail: 'cliente2@empresa.com',
    direccion: 'Calle 45 #78',
    telefono: '0412-987-6543',
    notasTecnico: '',
    insumosUtilizados: [],
    tecnicoAsignado: null
  },
  {
    id: 3,
    equipo: 'Aire de Ventana 18000 BTU',
    servicio: 'Cambio de capacitador',
    modelo: 'Haier',
    descripcion: 'Cambio de capacitor dañado',
    estatus: 'Completado',
    fecha: '2026-09-28',
    comprarEquipo: false,
    montoCotizado: null,
    cotizacionEnviada: false,
    cliente: 'Carlos López',
    clienteEmail: 'cliente3@empresa.com',
    direccion: 'Los Olivos, Sector B',
    telefono: '0416-555-1234',
    notasTecnico: 'Se realizó cambio de capacitor y limpieza',
    insumosUtilizados: ['Capacitor 45uF'],
    tecnicoAsignado: 'tecnico2@empresa.com'
  },
  {
    id: 4,
    equipo: 'Sistema Central',
    servicio: 'Revisión de termostato',
    modelo: 'Carrier',
    descripcion: 'Revisión general del sistema',
    estatus: 'Programado',
    fecha: '2026-10-10',
    comprarEquipo: false,
    montoCotizado: null,
    cotizacionEnviada: false,
    cliente: 'Ana Rodríguez',
    direccion: 'Edificio Central, Apt 5B',
    telefono: '0424-777-8888',
    notasTecnico: '',
    insumosUtilizados: [],
    tecnicoAsignado: null
  }
];

const defaultFacturas = [
  {
    id: 'FAC-001',
    fecha: '2026-09-15',
    concepto: 'Mantenimiento Preventivo Aire Split',
    monto: '$35.00',
    estatus: 'Pagada',
    montoFactura: '$35.00',
    montoReportado: '$35.00',
    clienteEmail: 'cliente@empresa.com',
    clienteNombre: 'María Pérez',
    clienteTelefono: '0414-123-4567',
    clienteDireccion: 'Av. Principal #123'
  },
  {
    id: 'FAC-002',
    fecha: '2026-09-20',
    concepto: 'Instalación de Aire Acondicionado',
    monto: '$45.00',
    estatus: 'Pagada',
    montoFactura: '$45.00',
    montoReportado: '$45.00',
    clienteEmail: 'cliente2@empresa.com',
    clienteNombre: 'Juan García',
    clienteTelefono: '0424-555-6666',
    clienteDireccion: 'Calle 45 #78'
  },
  {
    id: 'FAC-003',
    fecha: '2026-09-25',
    concepto: 'Desinstalación de Consola',
    monto: '$20.00',
    estatus: 'Pendiente',
    montoFactura: '$20.00',
    montoReportado: null,
    clienteEmail: 'cliente3@empresa.com',
    clienteNombre: 'Carlos López',
    clienteTelefono: '0416-777-8888',
    clienteDireccion: 'Av. Los Pinos #15'
  },
  {
    id: 'FAC-004',
    fecha: '2026-09-28',
    concepto: 'Mantenimiento Preventivo Refrigerador',
    monto: '$35.00',
    estatus: 'Pagada',
    montoFactura: '$35.00',
    montoReportado: '$35.00',
    clienteEmail: 'cliente4@empresa.com',
    clienteNombre: 'Ana Rodríguez',
    clienteTelefono: '0424-999-0000',
    clienteDireccion: 'Edificio Central, Apt 5B'
  },
  {
    id: 'FAC-005',
    fecha: '2026-09-29',
    concepto: 'Mantenimiento Preventivo Aire Split',
    monto: '$35.00',
    estatus: 'En Verificación',
    metodoPago: 'Pago Móvil',
    bancoOrigen: 'Banesco',
    referencia: '1234567890',
    fechaPago: '2026-09-29',
    montoBs: '1.277,50',
    montoFactura: '$35.00',
    montoReportado: '$36.00',
    clienteEmail: 'cliente@empresa.com',
    clienteNombre: 'María Pérez',
    clienteTelefono: '0414-123-4567',
    clienteDireccion: 'Av. Principal #123'
  },
  {
    id: 'FAC-006',
    fecha: '2026-09-29',
    concepto: 'Instalación de Aire Acondicionado',
    monto: '$45.00',
    estatus: 'En Verificación',
    metodoPago: 'Transferencia',
    bancoOrigen: 'Mercantil',
    referencia: '9876543210',
    fechaPago: '2026-09-29',
    montoBs: '1.642,50',
    montoFactura: '$45.00',
    montoReportado: '$43.00',
    clienteEmail: 'cliente2@empresa.com',
    clienteNombre: 'Juan García',
    clienteTelefono: '0424-555-6666',
    clienteDireccion: 'Calle 45 #78'
  },
  {
    id: 'FAC-007',
    fecha: '2026-09-29',
    concepto: 'Mantenimiento Preventivo Refrigerador',
    monto: '$35.00',
    estatus: 'En Verificación',
    metodoPago: 'Zelle',
    bancoOrigen: 'N/A',
    referencia: 'zelle-ref-123',
    fechaPago: '2026-09-29',
    montoBs: '1.277,50',
    montoFactura: '$35.00',
    montoReportado: '$35.00',
    clienteEmail: 'cliente3@empresa.com',
    clienteNombre: 'Carlos López',
    clienteTelefono: '0416-777-8888',
    clienteDireccion: 'Av. Los Pinos #15'
  }
];

// Cargar desde localStorage o usar defaults
let mockUsers = JSON.parse(localStorage.getItem('maher_users')) || defaultUsers;
let mockCitas = JSON.parse(localStorage.getItem('maher_citas')) || defaultCitas;
let mockFacturas = JSON.parse(localStorage.getItem('maher_facturas')) || defaultFacturas;
let mockInventario = JSON.parse(localStorage.getItem('maher_inventario')) || defaultInventario;

// Asegurar que las facturas existentes tengan los campos de montoFactura y montoReportado
mockFacturas = mockFacturas.map(factura => ({
  ...factura,
  montoFactura: factura.montoFactura || factura.monto,
  montoReportado: factura.montoReportado || (factura.estatus === 'Pagada' ? factura.monto : null)
}));

// Función para guardar en localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('maher_users', JSON.stringify(mockUsers));
  localStorage.setItem('maher_citas', JSON.stringify(mockCitas));
  localStorage.setItem('maher_facturas', JSON.stringify(mockFacturas));
  localStorage.setItem('maher_inventario', JSON.stringify(mockInventario));
};

export const loginUser = (credentials) => {
  return new Promise((resolve, reject) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      const { email, password } = credentials;

      // Validar contraseña
      if (!password || password.length < 3) {
        reject(new Error('La contraseña es demasiado corta o está vacía'));
        return;
      }

      // Determinar rol basado en el correo
      let role = 'cliente';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('tecnico')) {
        role = 'tecnico';
      }

      // Buscar usuario en mockUsers para obtener el nombre
      const user = mockUsers.find(u => u.email === email);
      const userName = user ? user.nombre : 'Usuario';

      // Simular respuesta exitosa con token y rol
      const response = {
        success: true,
        token: `simulated_token_${Date.now()}`,
        user: {
          email: email,
          nombre: userName,
          role: role
        }
      };

      resolve(response);
    }, 1000);
  });
};

export const registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      const { fullname, email, phone, cedula, direccion, password, terms } = userData;

      // Validaciones básicas
      if (!fullname || fullname.length < 2) {
        reject(new Error('El nombre completo es demasiado corto'));
        return;
      }

      if (!email || !email.includes('@')) {
        reject(new Error('El correo electrónico no es válido'));
        return;
      }

      if (!phone || phone.length < 10) {
        reject(new Error('El número de teléfono no es válido'));
        return;
      }

      if (!cedula || cedula.length < 5) {
        reject(new Error('La cédula/RIF es requerida'));
        return;
      }

      if (!direccion || direccion.length < 5) {
        reject(new Error('La dirección es requerida'));
        return;
      }

      if (!password || password.length < 3) {
        reject(new Error('La contraseña es demasiado corta'));
        return;
      }

      if (!terms) {
        reject(new Error('Debes aceptar los términos y condiciones'));
        return;
      }

      // Verificar si el email ya existe
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        reject(new Error('El correo electrónico ya está registrado'));
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        nombre: fullname,
        email: email,
        telefono: phone,
        cedula: cedula,
        direccion: direccion,
        password: password,
        role: 'cliente',
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage
      mockUsers.push(newUser);
      saveToLocalStorage();

      // Simular respuesta exitosa
      const response = {
        success: true,
        message: 'Registro exitoso',
        user: {
          nombre: fullname,
          email: email,
          telefono: phone,
          role: 'cliente',
          token: `simulated_token_${Date.now()}`
        }
      };

      resolve(response);
    }, 1000);
  });
};

export const recoverPassword = (email) => {
  return new Promise((resolve, reject) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      // Validación básica de email
      if (!email || !email.includes('@')) {
        reject(new Error('El correo electrónico no es válido'));
        return;
      }

      // Simular respuesta exitosa
      const response = {
        success: true,
        message: 'Instrucciones enviadas correctamente',
        email: email
      };

      resolve(response);
    }, 1000);
  });
};

export const getCitasCliente = () => {
  return new Promise((resolve) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      // Retornar la variable en memoria
      resolve(mockCitas);
    }, 1000);
  });
};

export const getFacturasCliente = () => {
  return new Promise((resolve) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      // Retornar la variable en memoria
      resolve(mockFacturas);
    }, 1000);
  });
};

export const reportarPagoFactura = (facturaId, pagoData) => {
  return new Promise((resolve, reject) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      const { moneda, metodo, bancoOrigen, cedulaOrigen, referencia, fechaPago, montoPagar, reciboFisico } = pagoData;

      // Validaciones básicas
      if (!moneda || !metodo) {
        reject(new Error('La moneda y método de pago son requeridos'));
        return;
      }

      // Validaciones específicas según el método
      if (metodo !== 'Efectivo') {
        if (!bancoOrigen || bancoOrigen.length < 2) {
          reject(new Error('El banco de origen es requerido'));
          return;
        }

        if (!referencia || referencia.length < 4) {
          reject(new Error('La referencia es requerida'));
          return;
        }

        if (!cedulaOrigen || cedulaOrigen.length < 5) {
          reject(new Error('La cédula del titular es requerida'));
          return;
        }
      }

      if (!fechaPago) {
        reject(new Error('La fecha del pago es requerida'));
        return;
      }

      if (!montoPagar || montoPagar.length < 1) {
        reject(new Error('El monto a pagar es requerido'));
        return;
      }

      // Actualizar el estatus de la factura en memoria
      const facturaIndex = mockFacturas.findIndex(f => f.id === facturaId);
      if (facturaIndex === -1) {
        reject(new Error('Factura no encontrada'));
        return;
      }

      mockFacturas[facturaIndex].estatus = 'En Verificación';
      mockFacturas[facturaIndex].metodoPago = metodo;
      mockFacturas[facturaIndex].bancoOrigen = bancoOrigen || 'N/A';
      mockFacturas[facturaIndex].cedulaOrigen = cedulaOrigen || 'N/A';
      mockFacturas[facturaIndex].referencia = referencia || 'Pago en efectivo';
      mockFacturas[facturaIndex].fechaPago = fechaPago;
      mockFacturas[facturaIndex].reciboFisico = reciboFisico || '';
      mockFacturas[facturaIndex].montoFactura = mockFacturas[facturaIndex].monto;
      // Formatear el monto reportado con símbolo de dólar si no lo tiene
      const montoNumerico = parseFloat(montoPagar);
      const montoFormateado = !isNaN(montoNumerico) ? `$${montoNumerico.toFixed(2)}` : montoPagar;
      mockFacturas[facturaIndex].montoReportado = montoFormateado;

      // Guardar en localStorage
      saveToLocalStorage();

      // Simular respuesta exitosa
      const response = {
        success: true,
        message: 'Pago reportado correctamente',
        factura: mockFacturas[facturaIndex]
      };

      resolve(response);
    }, 1000);
  });
};

export const createCitaCliente = (citaData) => {
  return new Promise((resolve, reject) => {
    // Simular delay de red de 1 segundo
    setTimeout(() => {
      const { tipoEquipo, tipoServicio, modelo, descripcion, fechaPreferida, comprarEquipo } = citaData;

      // Validaciones básicas
      if (!tipoEquipo || tipoEquipo.length < 2) {
        reject(new Error('El tipo de equipo es requerido'));
        return;
      }

      if (!tipoServicio || tipoServicio.length < 2) {
        reject(new Error('El tipo de servicio es requerido'));
        return;
      }

      if (!modelo || modelo.length < 2) {
        reject(new Error('El modelo/marca es requerido'));
        return;
      }

      if (!descripcion || descripcion.length < 10) {
        reject(new Error('La descripción debe tener al menos 10 caracteres'));
        return;
      }

      if (!fechaPreferida) {
        reject(new Error('La fecha preferida es requerida'));
        return;
      }

      // Obtener email del usuario actual
      const userEmail = localStorage.getItem('maher_user_email');

      // Determinar estatus según si es compra de equipo
      const estatus = comprarEquipo ? 'Pendiente por Cotizar' : 'Pendiente';

      // Crear nueva cita con id y estatus
      const nuevaCita = {
        id: Date.now(),
        equipo: tipoEquipo,
        servicio: tipoServicio,
        modelo: modelo,
        descripcion: descripcion,
        estatus: estatus,
        fecha: fechaPreferida,
        comprarEquipo: comprarEquipo,
        montoCotizado: null,
        cotizacionEnviada: false,
        clienteEmail: userEmail,
        cliente: 'Cliente',
        direccion: '',
        telefono: '',
        notasTecnico: '',
        insumosUtilizados: [],
        tecnicoAsignado: null
      };

      // Agregar a la variable en memoria
      mockCitas.push(nuevaCita);

      // Guardar en localStorage
      saveToLocalStorage();

      // Simular respuesta exitosa
      const response = {
        success: true,
        message: comprarEquipo 
          ? 'Solicitud de cotización enviada. Un asesor te contactará pronto.'
          : 'Solicitud de servicio creada exitosamente',
        cita: nuevaCita
      };

      resolve(response);
    }, 1000);
  });
};

export const aprobarPago = (facturaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const facturaIndex = mockFacturas.findIndex(f => f.id === facturaId);
      if (facturaIndex === -1) {
        reject(new Error('Factura no encontrada'));
        return;
      }

      const montoFactura = parseFloat(mockFacturas[facturaIndex].montoFactura.replace(/[$,]/g, ''));
      const montoReportado = parseFloat(mockFacturas[facturaIndex].montoReportado.replace(/[$,]/g, ''));
      const diferencia = montoReportado - montoFactura;

      // Actualizar estatus de la factura
      mockFacturas[facturaIndex].estatus = 'Pagada';
      mockFacturas[facturaIndex].montoFactura = mockFacturas[facturaIndex].montoFactura || mockFacturas[facturaIndex].monto;
      mockFacturas[facturaIndex].montoReportado = mockFacturas[facturaIndex].montoReportado || mockFacturas[facturaIndex].monto;

      // Si hay sobrante, registrarlo como saldo a favor
      if (diferencia > 0) {
        mockFacturas[facturaIndex].saldoFavor = `$${diferencia.toFixed(2)} USD`;
        mockFacturas[facturaIndex].nota = `Saldo a favor del cliente: $${diferencia.toFixed(2)} USD`;
      }

      // Buscar la cita asociada por concepto y actualizar su estatus
      const conceptoFactura = mockFacturas[facturaIndex].concepto;
      const citaIndex = mockCitas.findIndex(c => c.servicio === conceptoFactura || c.equipo === conceptoFactura);
      
      if (citaIndex !== -1) {
        mockCitas[citaIndex].estatus = 'Pago Verificado';
      }

      // Guardar en localStorage
      saveToLocalStorage();

      let message = 'Pago aprobado exitosamente';
      if (diferencia > 0) {
        message += `. Saldo a favor del cliente: $${diferencia.toFixed(2)} USD`;
      }

      const response = {
        success: true,
        message: message,
        factura: mockFacturas[facturaIndex]
      };

      resolve(response);
    }, 500);
  });
};

export const aprobarPagoParcial = (facturaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const facturaIndex = mockFacturas.findIndex(f => f.id === facturaId);
      if (facturaIndex === -1) {
        reject(new Error('Factura no encontrada'));
        return;
      }

      const montoFactura = parseFloat(mockFacturas[facturaIndex].montoFactura.replace(/[$,]/g, ''));
      const montoReportado = parseFloat(mockFacturas[facturaIndex].montoReportado.replace(/[$,]/g, ''));
      const deudaRestante = montoFactura - montoReportado;

      // Actualizar estatus de la factura a Pago Parcial
      mockFacturas[facturaIndex].estatus = 'Pago Parcial';
      mockFacturas[facturaIndex].montoFactura = mockFacturas[facturaIndex].montoFactura || mockFacturas[facturaIndex].monto;
      mockFacturas[facturaIndex].montoReportado = mockFacturas[facturaIndex].montoReportado || mockFacturas[facturaIndex].monto;
      mockFacturas[facturaIndex].montoAbonado = `$${montoReportado.toFixed(2)} USD`;
      mockFacturas[facturaIndex].deudaRestante = `$${deudaRestante.toFixed(2)} USD`;
      mockFacturas[facturaIndex].nota = `Pago parcial aceptado. Deuda restante: $${deudaRestante.toFixed(2)} USD`;

      // Guardar en localStorage
      saveToLocalStorage();

      const response = {
        success: true,
        message: `Pago parcial aprobado. Deuda restante: $${deudaRestante.toFixed(2)} USD`,
        factura: mockFacturas[facturaIndex]
      };

      resolve(response);
    }, 500);
  });
};

export const rechazarPago = (facturaId, razon) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!razon || razon.length < 5) {
        reject(new Error('La razón del rechazo es requerida'));
        return;
      }

      const facturaIndex = mockFacturas.findIndex(f => f.id === facturaId);
      if (facturaIndex === -1) {
        reject(new Error('Factura no encontrada'));
        return;
      }

      mockFacturas[facturaIndex].estatus = 'Rechazado';
      mockFacturas[facturaIndex].razonRechazo = razon;
      mockFacturas[facturaIndex].montoFactura = mockFacturas[facturaIndex].montoFactura || mockFacturas[facturaIndex].monto;
      mockFacturas[facturaIndex].montoReportado = mockFacturas[facturaIndex].montoReportado || mockFacturas[facturaIndex].monto;

      // Guardar en localStorage
      saveToLocalStorage();

      const response = {
        success: true,
        message: 'Pago rechazado exitosamente',
        factura: mockFacturas[facturaIndex]
      };

      resolve(response);
    }, 500);
  });
};

export const aceptarCotizacion = (citaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const citaIndex = mockCitas.findIndex(c => c.id === citaId);
      if (citaIndex === -1) {
        reject(new Error('Cita no encontrada'));
        return;
      }

      // Cambiar estatus a Pendiente para proceder con el pago
      mockCitas[citaIndex].estatus = 'Pendiente';

      // Crear factura con el monto cotizado
      const nuevaFactura = {
        id: `FAC-${Date.now()}`,
        fecha: new Date().toISOString().split('T')[0],
        concepto: `${mockCitas[citaIndex].equipo} - ${mockCitas[citaIndex].servicio}`,
        monto: `$${mockCitas[citaIndex].montoCotizado}`,
        estatus: 'Pendiente',
        citaId: citaId,
        montoFactura: `$${mockCitas[citaIndex].montoCotizado}`,
        montoReportado: null
      };

      mockFacturas.push(nuevaFactura);

      // Guardar en localStorage
      saveToLocalStorage();

      const response = {
        success: true,
        message: 'Cotización aceptada. Factura generada.',
        cita: mockCitas[citaIndex],
        factura: nuevaFactura
      };

      resolve(response);
    }, 500);
  });
};

export const getServiciosTecnico = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Obtener el email del técnico actual
      const tecnicoEmail = localStorage.getItem('maher_user_email');
      
      // Filtrar citas asignadas a este técnico que no están completadas
      const serviciosPendientes = mockCitas.filter(cita => 
        cita.tecnicoAsignado === tecnicoEmail &&
        cita.estatus !== 'Completado' && 
        cita.estatus !== 'Pago Verificado'
      );
      
      resolve(serviciosPendientes);
    }, 500);
  });
};

export const completarServicio = (citaId, reporteData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { notasTecnico, insumosUtilizados, nuevoEstatus } = reporteData;
      
      const citaIndex = mockCitas.findIndex(c => c.id === citaId);
      if (citaIndex === -1) {
        reject(new Error('Cita no encontrada'));
        return;
      }

      // Actualizar la cita con el reporte del técnico
      mockCitas[citaIndex].estatus = nuevoEstatus || 'Completado';
      mockCitas[citaIndex].notasTecnico = notasTecnico || '';
      mockCitas[citaIndex].insumosUtilizados = insumosUtilizados || [];

      // Descargar insumos del inventario
      if (insumosUtilizados && insumosUtilizados.length > 0) {
        insumosUtilizados.forEach(insumoNombre => {
          const itemIndex = mockInventario.findIndex(item => 
            item.nombre.includes(insumoNombre) || insumoNombre.includes(item.nombre)
          );
          if (itemIndex !== -1 && mockInventario[itemIndex].stock > 0) {
            mockInventario[itemIndex].stock -= 1;
          }
        });
      }

      // Guardar en localStorage
      saveToLocalStorage();

      const response = {
        success: true,
        message: 'Servicio completado exitosamente',
        cita: mockCitas[citaIndex]
      };

      resolve(response);
    }, 500);
  });
};

export const getTecnicos = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tecnicos = mockUsers.filter(user => user.role === 'tecnico');
      resolve(tecnicos);
    }, 500);
  });
};

export const asignarTecnico = (citaId, tecnicoEmail) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const citaIndex = mockCitas.findIndex(c => c.id === citaId);
      if (citaIndex === -1) {
        reject(new Error('Cita no encontrada'));
        return;
      }

      mockCitas[citaIndex].tecnicoAsignado = tecnicoEmail;
      
      // Guardar en localStorage
      saveToLocalStorage();

      const response = {
        success: true,
        message: 'Técnico asignado exitosamente',
        cita: mockCitas[citaIndex]
      };

      resolve(response);
    }, 500);
  });
};

export const getInventario = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockInventario);
    }, 500);
  });
};

export const agregarProductoInventario = (producto) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const nuevoProducto = {
        id: Date.now(),
        ...producto
      };
      
      mockInventario.push(nuevoProducto);
      
      // Guardar en localStorage
      saveToLocalStorage();

      const response = {
        success: true,
        message: 'Producto agregado exitosamente',
        producto: nuevoProducto
      };

      resolve(response);
    }, 500);
  });
};

export { mockInventario };