// backend/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3307, // usa 3306 si no cambiaste nada en XAMPP
  user: 'root',
  password: '', // pon tu contraseña si configuraste una
  database: 'sistema_servicios'
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('🟢 Conectado a MySQL');
});

module.exports = connection;
