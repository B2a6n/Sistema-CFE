
/* ==================  CONFIG GLOBAL  ================== */
const API = "http://localhost:3000/api"; // backend Express

/* =====================================================
   CARGA DE EVENTOS
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const formSolicitud = document.getElementById("solicitudForm");
  if (formSolicitud) formSolicitud.addEventListener("submit", enviarSolicitud);

  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", iniciarSesion);
    const msg = document.createElement("div");
    msg.id = "msg-login";
    msg.style.marginTop = "1rem";
    msg.style.fontWeight = "bold";
    formLogin.insertAdjacentElement("afterend", msg);
  }

  const formRegistro = document.getElementById("form-registro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", registrarUsuario);

    const inputContrasena = document.getElementById("contrasena");
    const aviso = document.createElement("div");
    aviso.id = "aviso-longitud";
    aviso.style.color = "orange";
    aviso.style.fontSize = "0.85rem";
    inputContrasena.insertAdjacentElement("afterend", aviso);

    inputContrasena.addEventListener("input", () => {
      aviso.textContent = inputContrasena.value.length < 6
        ? "La contraseña debe tener al menos 6 caracteres"
        : "";
    });

    const inputMedidor = document.getElementById("medidor");
    const avisoMedidor = document.createElement("div");
    avisoMedidor.id = "aviso-medidor";
    avisoMedidor.style.color = "orange";
    avisoMedidor.style.fontSize = "0.85rem";
    inputMedidor.insertAdjacentElement("afterend", avisoMedidor);

    inputMedidor.addEventListener("input", () => {
      const formatoMedidor = /^MED\d+$/i;
      if (!formRegistro.medidor.value.trim()) {
        avisoMedidor.textContent = "";
        inputMedidor.style.border = "";
      } else if (!formatoMedidor.test(formRegistro.medidor.value.trim())) {
        avisoMedidor.textContent = "El número de medidor debe iniciar con 'MED' seguido de números (ej. MED1419)";
        inputMedidor.style.border = "2px solid red";
      } else {
        avisoMedidor.textContent = "";
        inputMedidor.style.border = "";
      }
    });
  }
});

/* =====================================================
   LOGIN
   ===================================================== */
async function iniciarSesion(e) {
  e.preventDefault();
  const form = e.target;
  const correo = form.correo.value.trim();
  const contrasena = form.contrasena.value.trim();
  const msg = document.getElementById("msg-login");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    mostrarMensaje(msg, "El correo ingresado no es válido", "orange");
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "cliente-inicio.html";
    } else {
      mostrarMensaje(msg, data.mensaje || "Credenciales incorrectas", "red");
    }
  } catch (err) {
    console.error(err);
    mostrarMensaje(msg, "Servidor no disponible", "red");
  }
}

/* =====================================================
   SOLICITUD DE SERVICIO
   ===================================================== */
function enviarSolicitud(e) {
  e.preventDefault();
  const form = e.target;
  const resultado = document.getElementById("resultado");

  const nombre = form.nombre?.value.trim();
  const curp = form.curp?.value.trim();
  const telefono = form.telefono?.value.trim();
  const email = form.email?.value.trim();
  const direccion = form.direccion?.value.trim();
  const documento = form.documento?.value.trim();
  const descripcion = form.descripcion?.value.trim();

  if (!nombre || !curp || !telefono || !email || !direccion || !documento || !descripcion) {
    mostrarMensaje(resultado, "Por favor, completa todos los campos.", "red");
    return;
  }

  const folio = generarFolio();
  const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
  solicitudes.push({
    folio, nombre, curp, telefono, email, direccion, documento, descripcion,
    fecha: new Date().toLocaleString()
  });
  localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

  mostrarMensaje(
    resultado,
    `✅ Solicitud enviada correctamente.<br>Tu folio es: <strong>${folio}</strong>`,
    "green"
  );
  form.reset();
}

function generarFolio() {
  const año = new Date().getFullYear();
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `CFE-${año}-${numero}`;
}

/* =====================================================
   REGISTRO CLIENTE
   ===================================================== */
async function registrarUsuario(e) {
  e.preventDefault();
  const form = e.target;

  const nombre = form.nombre.value.trim();
  const apellidos = form.apellidos.value.trim();
  const correo = form.correo.value.trim();
  const contrasena = form.contrasena.value.trim();
  const confirmar = form.confirmar.value.trim();
  const curp = form.curp.value.trim();
  const telefono = form.telefono.value.trim();
  const calle = form.calle.value.trim();
  const numero = form.numero.value.trim();
  const colonia = form.colonia.value.trim();
  const municipio = form.municipio.value.trim();
  const codigo_postal = form.codigo_postal.value.trim();
  const estado = form.estado.value;
  const medidor = form.medidor.value.trim();
  const num_contrato = form.num_contrato.value.trim();
  const num_servicio = form.num_servicio.value.trim();
  const dia = form.dia.value.padStart(2, "0");
  const mes = form.mes.value.padStart(2, "0");
  const anio = form.anio.value;
  const fecha_nacimiento = `${anio}-${mes}-${dia}`;

  if (!nombre || !apellidos || !correo || !contrasena) {
    alert("Completa todos los campos obligatorios");
    return;
  }
  if (contrasena.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }
  if (contrasena !== confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }
  if (!medidor || !num_contrato || !num_servicio) {
    alert("Completa los datos del servicio (medidor/contrato/servicio)");
    return;
  }

  const campoMedidor = form.medidor;
  const avisoMedidor = document.getElementById("aviso-medidor");
  const formatoMedidor = /^MED\d+$/i;
  if (!formatoMedidor.test(medidor)) {
    avisoMedidor.textContent = "El número de medidor debe iniciar con 'MED' seguido de números (ej. MED1419)";
    campoMedidor.style.border = "2px solid red";
    return;
  } else {
    avisoMedidor.textContent = "";
    campoMedidor.style.border = "";
  }

  try {
    const res = await fetch(`${API}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre, apellidos, correo, contrasena,
        curp, telefono, fecha_nacimiento,
        calle, numero, colonia, municipio, codigo_postal, estado,
        medidor, num_contrato, num_servicio
      })
    });
    const data = await res.json();

    if (res.ok) {
      alert("Registro exitoso. Inicia sesión.");
      window.location.href = "index.html";
    } else {
      alert(data.error || "No se pudo registrar");
    }
  } catch (err) {
    console.error(err);
    alert("Servidor no disponible");
  }
}

/* =====================================================
   UTILIDAD VISUAL
   ===================================================== */
function mostrarMensaje(el, html, color) {
  if (!el) return;
  el.style.color = color;
  el.innerHTML = html;
}
