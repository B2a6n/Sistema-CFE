document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("solicitudForm");
  const resultado = document.getElementById("resultado");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita recargar la página

    // Capturar datos
    const nombre = form.nombre.value.trim();
    const curp = form.curp.value.trim();
    const telefono = form.telefono.value.trim();
    const email = form.email.value.trim();
    const direccion = form.direccion.value.trim();
    const documento = form.documento.value.trim();
    const descripcion = form.descripcion.value.trim();

    // Validar campos vacíos
    if (!nombre || !curp || !telefono || !email || !direccion || !documento || !descripcion) {
      resultado.style.color = "red";
      resultado.textContent = "Por favor, completa todos los campos.";
      return;
    }

    // Generar folio único
    const folio = generarFolio();

    // Crear objeto de solicitud
    const nuevaSolicitud = {
      folio,
      nombre,
      curp,
      telefono,
      email,
      direccion,
      documento,
      descripcion,
      fecha: new Date().toLocaleString()
    };

    // Obtener las solicitudes existentes (o lista vacía si no hay)
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

    // Agregar la nueva
    solicitudes.push(nuevaSolicitud);

    // Guardar de nuevo en localStorage
    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

    // Mostrar mensaje de éxito
    resultado.style.color = "green";
    resultado.innerHTML = `
      <p>✅ Solicitud enviada correctamente.</p>
      <p>Tu folio es: <strong>${folio}</strong></p>
    `;

    form.reset(); // Limpiar formulario
  });

  // Función para generar folio aleatorio
  function generarFolio() {
    const año = new Date().getFullYear();
    const numero = Math.floor(1000 + Math.random() * 9000);
    return `CFE-${año}-${numero}`;
  }
});
