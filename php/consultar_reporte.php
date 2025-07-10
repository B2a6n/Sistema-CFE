<?php
session_start();
header("Content-Type: application/json");
require 'conexion.php';

/* 1. Validar sesión */
if (!isset($_SESSION['id_servicio'])) {
    echo json_encode(["error"=>"Sesión expirada"]); exit;
}

$id_reporte = intval($_GET['id']);          // viene de localStorage
$id_servicio = intval($_SESSION['id_servicio']);

/* 2. Buscar el reporte y asegurarse que pertenece al usuario */
$stmt = $conn->prepare(
  "SELECT tipo_falla, ubicacion, descripcion, estatus, fecha_reporte
   FROM reportes
   WHERE id_reporte=? AND id_servicio=?"
);
$stmt->bind_param("ii", $id_reporte, $id_servicio);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error"=>"Reporte no encontrado"]);
}
