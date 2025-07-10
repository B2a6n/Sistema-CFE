<?php
session_start();
require 'conexion.php';

// ───── 1. CAPTURA DE DATOS ─────
$correo     = $_POST['correo']     ?? '';
$contrasena = $_POST['contrasena'] ?? '';

// ───── 2. VALIDAMOS EN BD ─────
$sql = "SELECT u.id_usuario, u.nombre, u.apellidos,
               s.id_servicio
        FROM   usuarios u
        JOIN   servicios s ON s.id_usuario = u.id_usuario
        WHERE  u.correo = ? AND u.contrasena = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $correo, $contrasena);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    // ───── 3. INICIAR SESIÓN ─────
    $_SESSION['id_usuario']  = $row['id_usuario'];
    $_SESSION['id_servicio'] = $row['id_servicio'];

    $stmt->close();
    $conn->close();

    // Éxito → al panel del cliente
    header("Location: ../cliente-inicio.html");
    exit;
} else {
    $stmt->close();
    $conn->close();

    // Falla → de vuelta al login con query ?error
    header("Location: ../index.html?error=1");
    exit;
}
?>
