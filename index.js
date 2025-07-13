// backend/index.js
const express = require('express');
const cors    = require('cors');

const authRoutes     = require('./routes/auth');      // login, registro
const usuarioRoutes  = require('./routes/usuario');   // actualizar datos
const reportesRoutes = require('./routes/reportes');  // guardar y consultar reportes

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Rutas ---------- */
app.use('/api', authRoutes);        // /api/login, /api/registro
app.use('/api', usuarioRoutes);     // /api/usuario/:id
app.use('/api', reportesRoutes);    // /api/reportes, /api/reporte/:id

/* ---------- Inicio del servidor ---------- */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
