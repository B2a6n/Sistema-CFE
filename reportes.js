// backend/routes/supervisor.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Ruta para asignar técnico y guardar en reporte_proceso
router.post("/asignar-tecnico", (req, res) => {
  const {
    folio, id_usuario, tipo_falla, fecha_reporte, descripcion,
    calle, numero, colonia, municipio, codigo_postal, referencias,
    id_tecnico, nombre_tecnico, especialidad_tecnico
  } = req.body;

  const estatus = "En Proceso";
  const fecha_asignacion = new Date(); // Guarda la hora actual

  const sqlInsertProceso = `
    INSERT INTO reporte_proceso (
      folio, id_usuario, tipo_falla, fecha_reporte, descripcion,
      estatus, fecha_asignacion, calle, numero, colonia, municipio,
      codigo_postal, referencias, id_tecnico, nombre_tecnico, especialidad_tecnico
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    folio, id_usuario, tipo_falla, fecha_reporte, descripcion,
    estatus, fecha_asignacion, calle, numero, colonia, municipio,
    codigo_postal, referencias, id_tecnico, nombre_tecnico, especialidad_tecnico
  ];

  db.query(sqlInsertProceso, values, (err, result) => {
    if (err) {
      console.error("Error al insertar en reporte_proceso:", err);
      return res.status(500).json({ error: "Error al asignar técnico" });
    }

    // Actualiza también el estado del reporte original
    const sqlUpdateReporte = `UPDATE reportes SET estatus = ? WHERE folio = ?`;
    db.query(sqlUpdateReporte, [estatus, folio], (err2) => {
      if (err2) {
        console.error("Error al actualizar estado en reportes:", err2);
        return res.status(500).json({ error: "Error al actualizar estado" });
      }

      res.json({ ok: true, message: "Técnico asignado con éxito" });
    });
  });
});

module.exports = router;
