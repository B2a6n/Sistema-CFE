document.addEventListener('DOMContentLoaded', async () => {
  await cargarReportes(); // Re-renderiza toda la tabla al cargar la página
});


let tecnicosDisponibles = [];
let folioSeleccionado = null;

// Cargar reportes pendientes y técnicos disponibles
async function cargarReportes() {
  const tabla = document.getElementById('tabla-reportes');
  tabla.innerHTML = '';

  try {
    // Peticiones al backend
    const [resReportes, resTecnicos] = await Promise.all([
      fetch('http://localhost:3000/api/supervisor/reportes-pendientes'),

      fetch('http://localhost:3000/api/supervisor/tecnicos-disponibles')

    ]);

    const reportes = await resReportes.json();
    tecnicosDisponibles = await resTecnicos.json();

    // Construcción de filas
    reportes.forEach(reporte => {
      const fila = document.createElement('tr');
      const direccion = `${reporte.calle} ${reporte.numero}, ${reporte.colonia}, ${reporte.municipio}, CP: ${reporte.codigo_postal}`;

      fila.innerHTML = `
        <td>${reporte.folio}</td>
        <td>${reporte.id_usuario}</td>
        <td>${direccion}</td>
        <td>${reporte.tipo_falla}</td>
        <td>${reporte.descripcion}</td>
        <td>
  <button class="btn-guardar" onclick="abrirModal(${reporte.folio})" data-folio="${reporte.folio}">Seleccionar</button>
</td>

      `;

      tabla.appendChild(fila);
    });

  } catch (error) {
    console.error('Error al cargar reportes o técnicos:', error);
  }
}

// Mostrar el modal de asignación
function abrirModal(folio) {
  folioSeleccionado = folio;

  const select = document.getElementById('lista-tecnicos');
  select.innerHTML = '<option value="">-- Seleccionar técnico --</option>';

  tecnicosDisponibles.forEach(tecnico => {
    const option = document.createElement('option');
    option.value = tecnico.id_tecnico;
    option.textContent = `${tecnico.nombre} - ${tecnico.especialidad}`;
    select.appendChild(option);
  });

  document.getElementById('modal-overlay').classList.remove('hidden');
}

// Cerrar modal
document.getElementById('btn-modal-cancelar').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.add('hidden');
});

/// Confirmar asignación
document.getElementById('btn-modal-asignar').addEventListener('click', async () => {
  const id_tecnico = document.getElementById('lista-tecnicos').value;

  if (!id_tecnico || !folioSeleccionado) {
    alert('Por favor selecciona un técnico válido');
    return;
  }

  // Verificar los datos antes de enviarlos
  console.log('Enviando solicitud para asignar técnico', folioSeleccionado, id_tecnico);

  try {
    const res = await fetch('http://localhost:3000/api/supervisor/asignar-tecnico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folio: folioSeleccionado, id_tecnico })
    });

    const data = await res.json();
    alert(data.mensaje || 'Técnico asignado con éxito');

    // Desactivar el botón de seleccionar
    const boton = document.querySelector(`button[data-folio='${folioSeleccionado}']`);
    if (boton) {
      boton.disabled = true;
      boton.textContent = 'Asignado';
    }

    // Cerrar modal
    document.getElementById('modal-overlay').classList.add('hidden');
    cargarReportes(); // Actualizar la tabla

  } catch (error) {
    console.error('Error al asignar técnico:', error);
  }
});
