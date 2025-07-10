<?php
session_start();
require 'conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error"=>"Sesión expirada"]); exit;
}
$id = $_SESSION['id_usuario'];
$res = $conn->query("SELECT correo, telefono FROM usuarios WHERE id_usuario=$id LIMIT 1");
echo json_encode($res->fetch_assoc());
