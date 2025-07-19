// backend/routes/supervisor.js
const express = require('express');
const router = express.Router();
const conexion = require('../db'); // Ya tienes db.js configurado

const db = require('../db');

// Verificar si la conexión a la base de datos está funcionando
db.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});


// Obtener reportes pendientes
router.get('/reportes-pendientes', (req, res) => {
  const sql = `
    SELECT folio, id_usuario, tipo_falla, descripcion, 
           calle, numero, colonia, municipio, codigo_postal, referencias
    FROM reportes
    WHERE estatus = 'Pendiente'
  `;
  conexion.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener reportes' });
    res.json(resultados);
  });
});

// Obtener técnicos disponibles
router.get('/tecnicos-disponibles', (req, res) => {
  const sql = `
    SELECT id_tecnico, nombre, especialidad 
    FROM tecnico 
    WHERE estatus = 'Disponible'
  `;
  conexion.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener técnicos' });
    res.json(resultados);
  });
});

// Ruta para asignar técnico y guardar en reporte_proceso
router.post('/asignar-tecnico', (req, res) => {
  const { folio, id_tecnico } = req.body;

  // Paso 1: Actualizar el estatus del reporte y asignar técnico
  const updateReporte = `
    UPDATE reportes 
    SET id_tecnico = ?, estatus = 'En Proceso', fecha_atencion = NOW()
    WHERE folio = ?
  `;

  conexion.query(updateReporte, [id_tecnico, folio], (err) => {
    if (err) {
      console.error('Error al asignar técnico (updateReporte):', err); // Mostrar el error detallado en la consola
      return res.status(500).json({ error: 'Error al asignar técnico (actualización reporte)' });
    }

    // Paso 2: Marcar técnico como Ocupado
    const updateTecnico = `UPDATE tecnico SET estatus = 'Ocupado' WHERE id_tecnico = ?`;
    conexion.query(updateTecnico, [id_tecnico], (err2) => {
      if (err2) {
        console.error('Error al actualizar técnico (updateTecnico):', err2); // Mostrar el error detallado en la consola
        return res.status(500).json({ error: 'Error al actualizar estado del técnico' });
      }

      // Paso 3: Obtener los datos del reporte y del técnico para insertar en reporte_proceso
      const query = `
        SELECT r.*, t.nombre AS nombre_tecnico, t.especialidad AS especialidad_tecnico
        FROM reportes r
        JOIN tecnico t ON r.id_tecnico = t.id_tecnico
        WHERE r.folio = ?
      `;

      conexion.query(query, [folio], (err3, resultados) => {
        if (err3 || resultados.length === 0) {
          console.error('Error al obtener datos para reporte_proceso:', err3); // Mostrar el error detallado en la consola
          return res.status(500).json({ error: 'Error al obtener datos para guardar en reporte_proceso' });
        }

        const r = resultados[0];

        const insert = `
          INSERT INTO reporte_proceso (
            folio, id_usuario, tipo_falla, fecha_reporte, descripcion, estatus,
            fecha_asignacion, calle, numero, colonia, municipio, codigo_postal, referencias,
            id_tecnico, nombre_tecnico, especialidad_tecnico
          )
          VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
          r.folio,
          r.id_usuario,
          r.tipo_falla,
          r.fecha_reporte,
          r.descripcion,
          'En Proceso',
          r.calle,
          r.numero,
          r.colonia,
          r.municipio,
          r.codigo_postal,
          r.referencias,
          r.id_tecnico,
          r.nombre_tecnico,
          r.especialidad_tecnico
        ];

        conexion.query(insert, valores, (err4) => {
          if (err4) {
            console.error('ERROR al insertar en reporte_proceso:', err4.sqlMessage); // Mostrar el error detallado en la consola
            return res.status(500).json({ error: err4.sqlMessage }); // Enviar el mensaje de error al cliente
          }

          res.json({ mensaje: 'Técnico asignado con éxito' }); // Si todo fue bien
        });
      });
    });
  });
});

module.exports = router;
