// backend/index.js
const express = require("express");
const cors = require("cors");

const authRoutes        = require("./routes/auth");
const usuarioRoutes     = require("./routes/usuario");
const reportesRoutes    = require("./routes/reportes");
const supervisorRoutes  = require("./routes/supervisor");
const restablecerRoutes = require("./routes/restablecer");

const app = express();

app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use("/api", authRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", reportesRoutes);
app.use("/api", restablecerRoutes);
app.use("/api/supervisor", supervisorRoutes); // Aquí van login, recuperación y asignación de técnicos

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor backend CFE activo.");
});

// Arranque
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`)
);
