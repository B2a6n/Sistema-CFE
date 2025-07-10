<?php
session_start();
header("Content-Type: application/json");
require 'conexion.php';

if (!isset($_SESSION['id_servicio'])) {
    echo json_encode(["error"=>"Sesión expirada"]); exit;
}

$id_reporte = intval($_GET['id'] ?? 0);

$stmt = $conn->prepare(
  "SELECT estatus FROM reportes
   WHERE id_reporte = ? AND id_servicio = ? LIMIT 1"
);
$stmt->bind_param("ii", $id_reporte, $_SESSION['id_servicio']);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode(["estatus" => $row['estatus']]);
} else {
    echo json_encode(["error" => "No existe el reporte"]);
}
?>
