// backend/routes/usuario.js
const express = require('express');
const router  = express.Router();
const db      = require('../db'); // conexión mysql2

/* =====================================================
   PUT /api/usuario/:id
   Recibe cualquier combinación de {correo, contrasena, telefono}
   y devuelve el usuario actualizado.
   ===================================================== */
router.put('/usuario/:id', (req, res) => {
  const { id } = req.params;
  let   { correo, contrasena, telefono } = req.body;

  // 1. Cargar valores actuales para rellenar faltantes
  db.query('SELECT correo, contrasena, telefono FROM usuarios WHERE id_usuario = ?', [id],
  (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error de servidor' });
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const previo = rows[0];

    correo     = correo     || previo.correo;
    contrasena = contrasena || previo.contrasena;
    telefono   = telefono   || previo.telefono;

    // 2. Actualizar
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

      // 3. Respuesta con datos nuevos
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

  // 1. Verificar existencia del usuario con ese correo
  const sqlBuscar = 'SELECT id_usuario FROM usuarios WHERE correo = ?';

  db.query(sqlBuscar, [correo], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en la base de datos' });

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Correo no registrado' });
    }

    const id_usuario = results[0].id_usuario;

    // 2. Actualizar contraseña
    const sqlActualizar = 'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?';
    db.query(sqlActualizar, [nueva, id_usuario], (err2) => {
      if (err2) return res.status(500).json({ mensaje: 'No se pudo actualizar la contraseña' });

      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
});

module.exports = router;
