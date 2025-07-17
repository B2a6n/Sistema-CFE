// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const db = require("../db");

/* =====================================================
   LOGIN
   ===================================================== */
router.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ mensaje: "Faltan datos de acceso" });

  // Paso 1: Verificar si existe el correo
  const sqlCorreo = `SELECT * FROM usuarios WHERE correo = ? LIMIT 1`;

  db.query(sqlCorreo, [correo], (err, results) => {
    if (err) {
      console.error("Error al buscar correo:", err);
      return res.status(500).json({ mensaje: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Correo no registrado" });
    }

    const usuario = results[0];

    // Paso 2: Validar contraseña
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Paso 3: Traer info adicional si todo es correcto
    const sql = `
      SELECT  u.id_usuario, u.nombre, u.apellidos, u.correo, u.curp,
              u.telefono, u.fecha_nacimiento,
              s.id_servicio, s.num_contrato, s.num_medidor,
              d.calle, d.numero, d.colonia, d.municipio,
              d.codigo_postal, d.estado
      FROM    usuarios u
      LEFT JOIN servicios s  ON s.id_usuario   = u.id_usuario
      LEFT JOIN direccion  d ON d.id_direccion = s.id_direccion
      WHERE   u.id_usuario = ?
      LIMIT 1
    `;

    db.query(sql, [usuario.id_usuario], (err2, rows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ mensaje: "Error al obtener datos del usuario" });
      }

      res.json({ mensaje: "Inicio de sesión exitoso", usuario: rows[0] });
    });
  });
});

/* =====================================================
   REGISTRO
   ===================================================== */
router.post("/registro", (req, res) => {
  const {
    nombre, apellidos, correo, contrasena,
    curp, telefono, fecha_nacimiento,
    calle, numero, colonia, municipio, codigo_postal, estado,
    medidor, num_contrato
  } = req.body;

  if (!nombre || !apellidos || !correo || !contrasena || !medidor || !num_contrato)
    return res.status(400).json({ error: "Datos incompletos" });

  // 1. Dirección
  const sqlDir = `
    INSERT INTO direccion
      (calle, numero, colonia, municipio, codigo_postal, estado)
    VALUES (?,?,?,?,?,?)
  `;
  db.query(sqlDir, [calle, numero, colonia, municipio, codigo_postal, estado],
    (errDir, dirRes) => {
      if (errDir) {
        console.error(errDir);
        return res.status(500).json({ error: "Error al guardar dirección" });
      }

      const idDireccion = dirRes.insertId;

      // 2. Usuario
      const sqlUser = `
        INSERT INTO usuarios
          (nombre, apellidos, correo, contrasena, curp, telefono, fecha_nacimiento)
        VALUES (?,?,?,?,?,?,?)
      `;
      db.query(sqlUser,
        [nombre, apellidos, correo, contrasena, curp, telefono, fecha_nacimiento],
        (errUser, userRes) => {
          if (errUser) {
            console.error(errUser);
            if (errUser.code === "ER_DUP_ENTRY")
              return res.status(409).json({ error: "El correo ya está registrado" });
            return res.status(500).json({ error: "Error al registrar usuario" });
          }

          const idUsuario = userRes.insertId;

          // 3. Servicio
          const sqlServ = `
            INSERT INTO servicios
              (id_usuario, id_direccion, num_medidor, num_contrato)
            VALUES (?,?,?,?)
          `;
          db.query(sqlServ,
            [idUsuario, idDireccion, medidor, num_contrato],
            (errServ) => {
              if (errServ) {
                console.error(errServ);
                if (errServ.code === "ER_DUP_ENTRY")
                  return res.status(409).json({ error: "Contrato duplicado" });
                return res.status(500).json({ error: "Error al guardar servicio" });
              }

              return res.json({ mensaje: "Usuario, dirección y servicio creados exitosamente" });
            });
        });
    });
});

module.exports = router;
