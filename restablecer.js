const express = require('express');
const router = express.Router();
const conexion = require('../db'); // Asegúrate que sea la conexión correcta

// Ruta para restablecer contraseña
router.put('/restablecer-contrasena', (req, res) => {
  const { correo, nueva, tipo } = req.body;

  if (!correo || !nueva || !tipo) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const tabla = tipo === 'supervisor' ? 'supervisor' : 'usuarios'; // ajusta si tu tabla cliente es diferente
  const campoCorreo = tipo === 'supervisor' ? 'correo' : 'correo'; // por si en futuro cambia

  const query = `UPDATE ${tabla} SET contrasena = ? WHERE ${campoCorreo} = ?`;

  conexion.query(query, [nueva, correo], (err, result) => {
    if (err) {
      console.error('Error al restablecer contraseña:', err);
      return res.status(500).json({ error: 'Error al actualizar contraseña' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Correo no encontrado' });
    }

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  });
});

module.exports = router;
