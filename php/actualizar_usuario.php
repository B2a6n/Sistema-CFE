<?php
session_start();
require 'conexion.php';

if (!isset($_SESSION['id_usuario'])) { header("Location: ../index.html"); exit; }

$id        = $_SESSION['id_usuario'];
$correo    = $_POST['correo']    ?? '';
$telefono  = $_POST['telefono']  ?? '';
$password  = $_POST['password']  ?? '';

$sql = "UPDATE usuarios SET correo=?, telefono=?, contrasena=? WHERE id_usuario=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $correo, $telefono, $password, $id);

if ($stmt->execute()) {
  header("Location: ../cliente-inicio.html?update=ok");
} else {
  echo "Error: ".$stmt->error;
}
?>
