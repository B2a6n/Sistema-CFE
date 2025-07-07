<?php
$host = "localhost";
$usuario = "root";
$contrasena = ""; // cámbiala si usas contraseña en tu MySQL
$base_datos = "sistema_servicios";
$puerto = 3307; // cámbialo a 3306 si tu XAMPP/MAMP usa el puerto por defecto

$conn = new mysqli($host, $usuario, $contrasena, $base_datos, $puerto);

// Comprobar conexión
if ($conn->connect_error) {
    die("❌ Error en la conexión: " . $conn->connect_error);
}
?>
