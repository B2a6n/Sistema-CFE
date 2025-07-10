<?php
session_start();
require 'conexion.php';

/* 1. Verificar sesión */
if (!isset($_SESSION['id_servicio'])) {
    echo json_encode(["ok"=>false,"error"=>"Sesión expirada. Vuelve a iniciar sesión."]);
    exit;
}
$id_servicio = intval($_SESSION['id_servicio']);

/* 2. Capturar datos del formulario */
$tipo          = $_POST['tipo']         ?? '';
$ubicacion     = $_POST['ubicacion']    ?? '';
$observaciones = $_POST['observaciones']?? '';

/* Validación mínima */
if (!$tipo || !$ubicacion || !$observaciones) {
    echo json_encode(["ok"=>false,"error"=>"Todos los campos son obligatorios."]);
    exit;
}

/* 3. Insertar en la tabla reportes */
$stmt = $conn->prepare(
  "INSERT INTO reportes
   (id_servicio, tipo_falla, ubicacion, descripcion, estatus)
   VALUES (?,?,?,?, 'Pendiente')"
);
$stmt->bind_param("isss", $id_servicio, $tipo, $ubicacion, $observaciones);

if ($stmt->execute()) {
    echo json_encode(["ok"=>true, "id_reporte"=>$stmt->insert_id]);
} else {
    echo json_encode(["ok"=>false, "error"=>$stmt->error]);
}

$stmt->close();
$conn->close();
?>
