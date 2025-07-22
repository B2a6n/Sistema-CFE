// backend/routes/usuario.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/* =====================================================
   POST /api/usuario
   Registra un nuevo usuario y su dirección
   ===================================================== */
router.post('/usuario', (req, res) => {
  const {
    nombre,
    apellidos,
    fecha_nacimiento,
    correo,
    contrasena,
    telefono,
    curp,
    num_contrato,
    medidor,
    calle,
    numero,
    colonia,
    municipio,
    codigo_postal,
    estado,
    referencias
  } = req.body;

  if (!nombre || !apellidos || !fecha_nacimiento || !correo || !contrasena || !telefono || !curp || !num_contrato || !medidor ||
      !calle || !numero || !colonia || !municipio || !codigo_postal || !estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sqlUsuario = `
    INSERT INTO usuarios (nombre, apellidos, fecha_nacimiento, correo, contrasena, telefono, curp, num_contrato, medidor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlUsuario, [nombre, apellidos, fecha_nacimiento, correo, contrasena, telefono, curp, num_contrato, medidor], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }

    const id_usuario = result.insertId;

    const sqlDireccion = `
      INSERT INTO direccion (calle, numero, colonia, municipio, codigo_postal, estado, referencias, id_usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlDireccion, [calle, numero, colonia, municipio, codigo_postal, estado, referencias, id_usuario], (err2) => {
      if (err2) {
        console.error('Error al guardar dirección:', err2);
        return res.status(500).json({ error: 'Usuario creado, pero error en dirección' });
      }

      res.json({ ok: true, mensaje: 'Usuario y dirección registrados correctamente', id_usuario });
    });
  });
});

/* =====================================================
   PUT /api/usuario/:id
   Actualiza correo, contraseña o teléfono
   ===================================================== */
router.put('/usuario/:id', (req, res) => {
  const { id } = req.params;
  let { correo, contrasena, telefono } = req.body;

  db.query('SELECT correo, contrasena, telefono FROM usuarios WHERE id_usuario = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error de servidor' });
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const previo = rows[0];
    correo = correo || previo.correo;
    contrasena = contrasena || previo.contrasena;
    telefono = telefono || previo.telefono;

    const sql = `
      UPDATE usuarios
      SET correo = ?, contrasena = ?, telefono = ?
      WHERE id_usuario = ?
    `;

    db.query(sql, [correo, contrasena, telefono, id], (err2) => {
      if (err2) {
        if (err2.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        return res.status(500).json({ error: 'Error al actualizar' });
      }

      res.json({
        mensaje: 'Datos actualizados correctamente',
        usuario: { id_usuario: id, correo, contrasena, telefono }
      });
    });
  });
});

/* =====================================================
   PUT /api/restablecer-contrasena
   Restablece la contraseña usando el correo
   ===================================================== */
router.put('/restablecer-contrasena', (req, res) => {
  const { correo, nueva } = req.body;

  if (!correo || !nueva) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  db.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en la base de datos' });

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Correo no registrado' });
    }

    const id_usuario = results[0].id_usuario;
    db.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [nueva, id_usuario], (err2) => {
      if (err2) return res.status(500).json({ mensaje: 'No se pudo actualizar la contraseña' });
      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
});

/* =====================================================
   GET /api/usuario/:id/direccion
   Devuelve la dirección del usuario desde tabla 'direccion'
   ===================================================== */
router.get('/usuario/:id/direccion', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT calle, numero, colonia, municipio, codigo_postal, estado, referencias
    FROM direccion
    WHERE id_usuario = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("🛑 Error al obtener dirección:", err.sqlMessage || err.message || err);
      return res.status(500).json({
        error: "Error al obtener la dirección",
        detalle: err.sqlMessage || err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Dirección no encontrada" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
