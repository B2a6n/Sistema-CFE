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

    const inputCP = document.getElementById("codigo_postal");
    const avisoCP = document.createElement("div");
    avisoCP.id = "aviso-cp";
    avisoCP.style.color = "orange";
    avisoCP.style.fontSize = "0.85rem";
    inputCP.insertAdjacentElement("afterend", avisoCP);

    inputCP.addEventListener("input", () => {
      const valor = inputCP.value.trim();
      if (!/^[0-9]{5}$/.test(valor)) {
        avisoCP.textContent = "El código postal debe ser numérico y tener 5 dígitos";
        inputCP.style.border = "2px solid red";
      } else {
        avisoCP.textContent = "";
        inputCP.style.border = "";
      }
    });

    const inputCorreo = document.getElementById("correo");
    const avisoCorreo = document.createElement("div");
    avisoCorreo.id = "aviso-correo";
    avisoCorreo.style.color = "orange";
    avisoCorreo.style.fontSize = "0.85rem";
    inputCorreo.insertAdjacentElement("afterend", avisoCorreo);

    inputCorreo.addEventListener("input", () => {
      const valor = inputCorreo.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!valor) {
        avisoCorreo.textContent = "";
        inputCorreo.style.border = "";
      } else if (!emailRegex.test(valor)) {
        avisoCorreo.textContent = "El correo electrónico no tiene un formato válido (debe incluir @ y dominio)";
        inputCorreo.style.border = "2px solid red";
      } else {
        avisoCorreo.textContent = "";
        inputCorreo.style.border = "";
      }
    });

    const inputTelefono = document.getElementById("telefono");
    const avisoTelefono = document.createElement("div");
    avisoTelefono.id = "aviso-telefono";
    avisoTelefono.style.color = "orange";
    avisoTelefono.style.fontSize = "0.85rem";
    inputTelefono.insertAdjacentElement("afterend", avisoTelefono);

    inputTelefono.addEventListener("input", () => {
      const valor = inputTelefono.value.trim();
      if (!/^\d{10}$/.test(valor)) {
        avisoTelefono.textContent = "El teléfono debe tener exactamente 10 dígitos numéricos";
        inputTelefono.style.border = "2px solid red";
      } else {
        avisoTelefono.textContent = "";
        inputTelefono.style.border = "";
      }
    });
  }

  const formReporte = document.getElementById("form-reporte");
  if (formReporte) formReporte.addEventListener("submit", generarReporte);
});

/* ================== FUNCIONES ================== */

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

function enviarSolicitud(e) {
  e.preventDefault();
}

async function registrarUsuario(e) {
  e.preventDefault();
}

async function generarReporte(e) {
  e.preventDefault();
  const form = e.target;

  const tipo_falla = form.tipo_falla.value;
  const calle = form.calle.value.trim();
  const numero = form.numero.value.trim();
  const colonia = form.colonia.value.trim();
  const municipio = form.municipio.value.trim();
  const codigo_postal = form.codigo_postal.value.trim();
  const referencias = form.referencias?.value.trim() || "";
  const descripcion = form.descripcion.value.trim(); // CORREGIDO

  if (!tipo_falla || !calle || !numero || !colonia || !municipio || !codigo_postal) {
    alert("Por favor, llena todos los campos obligatorios.");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.id_usuario) {
    alert("No se ha iniciado sesión.");
    return;
  }

  try {
    const res = await fetch(`${API}/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
        tipo_falla,
        calle,
        numero,
        colonia,
        municipio,
        codigo_postal,
        referencias,
        descripcion // CORREGIDO
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`✅ Reporte generado con éxito. Folio: ${data.folio}`);
      form.reset();
    } else {
      alert(data.error || "Error al generar reporte.");
    }
  } catch (err) {
    console.error(err);
    alert("No se pudo conectar con el servidor.");
  }
}

function mostrarMensaje(el, html, color) {
  if (!el) return;
  el.style.color = color;
  el.innerHTML = html;
}
