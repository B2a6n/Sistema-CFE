<?php
$host = "127.0.0.1:3307";
$user = "root";
$pass = "";                // pon tu contraseña si la configuraste
$db   = "sistema_servicios";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$conn->set_charset("utf8");
?>
