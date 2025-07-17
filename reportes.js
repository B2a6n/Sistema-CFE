// backend/routes/reportes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/reportes", (req, res) => {
  console.log("Cuerpo recibido:", req.body);

  const {
    id_usuario,
    tipo_falla,
    calle,
    numero,
    colonia,
    municipio,
    codigo_postal,
    referencias,
    descripcion
  } = req.body;

  if (!id_usuario || !tipo_falla || !calle || !numero || !colonia || !municipio || !codigo_postal) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const estatus = "Pendiente";

  const sqlInsert = `
    INSERT INTO reportes
      (id_usuario, tipo_falla, descripcion, fecha_reporte, estatus,
       calle, numero, colonia, municipio, codigo_postal, referencias)
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_usuario,
    tipo_falla,
    descripcion || '',
    estatus,
    calle,
    numero,
    colonia,
    municipio,
    codigo_postal,
    referencias || ''
  ];

  db.query(sqlInsert, values, (err, result) => {
    if (err) {
      console.error("Error al insertar:", err);
      return res.status(500).json({ error: "Error al guardar el reporte" });
    }

    const folio = result.insertId; // Ahora 'folio' es la PK autoincremental

    res.json({
      ok: true,
      folio,
      estatus
    });
  });
});

module.exports = router;
