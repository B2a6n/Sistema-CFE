/* ==================  CONFIG GLOBAL  ================== */
const API = 'http://localhost:3000/api';   // backend Express

/* ===================================================== */
/* =========  CARGA DE EVENTOS AL CARGAR PÁGINA ========= */
document.addEventListener('DOMContentLoaded', () => {
  const formSolicitud = document.getElementById('solicitudForm');
  if (formSolicitud) formSolicitud.addEventListener('submit', enviarSolicitud);

  const formLogin = document.getElementById('form-login');
  if (formLogin) formLogin.addEventListener('submit', iniciarSesion);

  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) formRegistro.addEventListener('submit', registrarUsuario);
});

/* ===================================================== */
/* ==============  SOLICITUD DE SERVICIO  =============== */
function enviarSolicitud(e) {
  e.preventDefault();
  const form      = e.target;
  const resultado = document.getElementById('resultado');

  const nombre      = form.nombre?.value.trim();
  const curp        = form.curp?.value.trim();
  const telefono    = form.telefono?.value.trim();
  const email       = form.email?.value.trim();
  const direccion   = form.direccion?.value.trim();
  const documento   = form.documento?.value.trim();
  const descripcion = form.descripcion?.value.trim();

  if (!nombre || !curp || !telefono || !email || !direccion || !documento || !descripcion) {
    mostrarMensaje(resultado, 'Por favor, completa todos los campos.', 'red');
    return;
  }

  const folio = generarFolio();
  const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
  solicitudes.push({
    folio, nombre, curp, telefono, email, direccion, documento, descripcion,
    fecha: new Date().toLocaleString()
  });
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes));

  mostrarMensaje(
    resultado,
    `✅ Solicitud enviada correctamente.<br>Tu folio es: <strong>${folio}</strong>`,
    'green'
  );
  form.reset();
}

function generarFolio() {
  const año = new Date().getFullYear();
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `CFE-${año}-${numero}`;
}

/* ===================================================== */
/* ====================  LOGIN  ========================= */
async function iniciarSesion(e) {
  e.preventDefault();
  const form = e.target;
  const correo     = form.correo.value.trim();
  const contrasena = form.contrasena.value.trim();

  try {
    const res  = await fetch(`${API}/login`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ correo, contrasena })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.location.href = 'cliente-inicio.html';
    } else {
      alert(data.mensaje || 'Credenciales incorrectas');
    }
  } catch (err) {
    console.error(err);
    alert('Servidor no disponible');
  }
}

/* ===================================================== */
/* ================  REGISTRO CLIENTE  ================== */
async function registrarUsuario(e) {
  e.preventDefault();
  const form = e.target;

  /* -------- Datos personales -------- */
  const nombre     = form.nombre.value.trim();
  const apellidos  = form.apellidos.value.trim();
  const correo     = form.correo.value.trim();
  const contrasena = form.contrasena.value.trim();
  const confirmar  = form.confirmar.value.trim();
  const curp       = form.curp.value.trim();
  const telefono   = form.telefono.value.trim();

  /* -------- Dirección -------- */
  const calle         = form.calle.value.trim();
  const numero        = form.numero.value.trim();
  const colonia       = form.colonia.value.trim();
  const municipio     = form.municipio.value.trim();      // <-- ahora coincide con name="municipio"
  const codigo_postal = form.codigo_postal.value.trim();  // <-- coincide con name="codigo_postal"
  const estado        = form.estado.value;

  /* -------- Fecha de nacimiento -------- */
  const dia  = form.dia.value.padStart(2, '0');
  const mes  = form.mes.value.padStart(2, '0');
  const anio = form.anio.value;
  const fecha_nacimiento = `${anio}-${mes}-${dia}`;   // YYYY-MM-DD

  /* -------- Validaciones -------- */
  if (!nombre || !apellidos || !correo || !contrasena) {
    alert('Completa todos los campos obligatorios');
    return;
  }
  if (contrasena !== confirmar) {
    alert('Las contraseñas no coinciden');
    return;
  }

  /* -------- Enviar al backend -------- */
  try {
    const res = await fetch(`${API}/registro`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        /* personales */
        nombre, apellidos, correo, contrasena,
        curp, telefono, fecha_nacimiento,
        /* dirección */
        calle, numero, colonia, municipio, codigo_postal, estado
      })
    });
    const data = await res.json();

    if (res.ok) {
      alert('Registro exitoso. Inicia sesión.');
      window.location.href = 'index.html';
    } else {
      alert(data.error || 'No se pudo registrar');
    }
  } catch (err) {
    console.error(err);
    alert('Servidor no disponible');
  }
}

/* ===================================================== */
/* ===============  UTILIDAD VISUAL  ==================== */
function mostrarMensaje(el, html, color) {
  if (!el) return;
  el.style.color = color;
  el.innerHTML   = html;
}
