const express = require("express");
const router = express.Router();
const db = require("../db");

/* ========================================
   LOGIN
======================================== */
router.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena)
    return res.status(400).json({ mensaje: "Faltan datos de acceso" });

  const sqlCorreo = `SELECT * FROM usuarios WHERE correo = ? LIMIT 1`;

  db.query(sqlCorreo, [correo], (err, results) => {
    if (err) {
      console.error("❌ Error al buscar usuario:", err);
      return res.status(500).json({ mensaje: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Correo no registrado" });
    }

    const usuario = results[0];

    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Consulta final para obtener los datos con dirección
    const sql = `
      SELECT u.id_usuario, u.nombre, u.apellidos, u.correo, u.contrasena, u.curp,
             u.telefono, u.fecha_nacimiento, u.num_contrato, u.medidor,
             d.calle, d.numero, d.colonia, d.municipio,
             d.codigo_postal, d.estado, d.referencias
      FROM usuarios u
      LEFT JOIN direccion d ON d.id_usuario = u.id_usuario
      WHERE u.correo = ?
      LIMIT 1
    `;

    db.query(sql, [correo], (err2, rows) => {
      if (err2) {
        console.error("❌ Error al obtener datos completos:", err2);
        return res.status(500).json({ mensaje: "Error al obtener datos del usuario" });
      }

      res.json({ mensaje: "Inicio de sesión exitoso", usuario: rows[0] });
    });
  });
});

/* ========================================
   REGISTRO
======================================== */
router.post("/registro", (req, res) => {
  const {
    nombre, apellidos, correo, contrasena,
    curp, telefono, fecha_nacimiento,
    calle, numero, colonia, municipio, codigo_postal, estado, referencias,
    medidor, num_contrato, num_servicio
  } = req.body;

  if (!nombre || !apellidos || !correo || !contrasena ||
      !medidor || !num_contrato || !num_servicio) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // 1. Insertar dirección
  const sqlDir = `
    INSERT INTO direccion
      (calle, numero, colonia, municipio, codigo_postal, estado, referencias)
    VALUES (?,?,?,?,?,?,?)
  `;
  db.query(sqlDir, [calle, numero, colonia, municipio, codigo_postal, estado, referencias],
    (errDir, dirRes) => {
      if (errDir) {
        console.error("❌ Error al guardar dirección:", errDir);
        return res.status(500).json({ error: "Error al guardar dirección" });
      }

      const idDireccion = dirRes.insertId;

      // 2. Insertar usuario
      const sqlUser = `
        INSERT INTO usuarios
          (nombre, apellidos, correo, contrasena, curp, telefono, fecha_nacimiento)
        VALUES (?,?,?,?,?,?,?)
      `;
      db.query(sqlUser,
        [nombre, apellidos, correo, contrasena, curp, telefono, fecha_nacimiento],
        (errUser, userRes) => {
          if (errUser) {
            console.error("❌ Error al registrar usuario:", errUser);
            if (errUser.code === "ER_DUP_ENTRY")
              return res.status(409).json({ error: "El correo ya está registrado" });
            return res.status(500).json({ error: "Error al registrar usuario" });
          }

          const idUsuario = userRes.insertId;

          // 3. Insertar servicio
          const sqlServ = `
            INSERT INTO servicios
              (id_usuario, id_direccion, num_medidor, num_contrato, num_servicio)
            VALUES (?,?,?,?,?)
          `;
          db.query(sqlServ,
            [idUsuario, idDireccion, medidor, num_contrato, num_servicio],
            (errServ) => {
              if (errServ) {
                console.error("❌ Error al guardar servicio:", errServ);
                if (errServ.code === "ER_DUP_ENTRY")
                  return res.status(409).json({ error: "Contrato o servicio duplicado" });
                return res.status(500).json({ error: "Error al guardar servicio" });
              }

              return res.json({ mensaje: "Usuario, dirección y servicio creados exitosamente" });
            });
        });
    });
});

module.exports = router;
