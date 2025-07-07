<?php
require 'conexion.php';

// Verificar si se enviaron los campos necesarios
if (isset($_POST['correo'], $_POST['password'])) {
    $correo = trim($_POST['correo']);
    $password = $_POST['password'];

    // Buscar usuario por correo
    $stmt = $conn->prepare("SELECT u.id_usuario, u.nombre, u.apellidos, u.correo, s.numero_servicio, u.contrasena
                             FROM usuarios u
                             JOIN servicios s ON u.id_usuario = s.id_usuario
                             WHERE u.correo = ? LIMIT 1");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();

        // Verificar contraseña
        if (password_verify($password, $usuario['contrasena'])) {
            // Iniciar sesión y redirigir
            session_start();
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nombre'] = $usuario['nombre'];
            $_SESSION['numero_servicio'] = $usuario['numero_servicio'];

            echo "<script>window.location.href = '../cliente/cliente-inicio.html';</script>";
            exit;
        } else {
            echo "<script>alert('❌ Contraseña incorrecta'); window.history.back();</script>";
            exit;
        }
    } else {
        echo "<script>alert('❌ Usuario no encontrado'); window.history.back();</script>";
        exit;
    }
} else {
    echo "<script>alert('❌ Faltan datos'); window.history.back();</script>";
    exit;
}
?>
