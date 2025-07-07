<?php
// ACTIVAR ERRORES
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CONEXIÓN
require_once "conexion.php";

// VALIDAR POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Captura
    $nombre = trim($_POST["nombre"]);
    $apellidoPaterno = trim($_POST["apellidoPaterno"]);
    $apellidoMaterno = trim($_POST["apellidoMaterno"]);
    $curp = trim($_POST["curp"]);
    $telefono = trim($_POST["telefono"]);
    $correo = trim($_POST["correo"]);
    $password = trim($_POST["password"]);
    $confirmar = trim($_POST["confirmar"]);

    $calle = trim($_POST["calle"]);
    $numero = trim($_POST["numero"]);
    $colonia = trim($_POST["colonia"]);
    $codigo_postal = trim($_POST["cp"]);
    $municipio = trim($_POST["ciudad"]);
    $estado = trim($_POST["estado"]);

    $dia = trim($_POST["dia"]);
    $mes = trim($_POST["mes"]);
    $anio = trim($_POST["anio"]);
    $fecha_nacimiento = "$anio-$mes-$dia";

    // Verificar contraseñas
    if ($password !== $confirmar) {
        die("❌ Las contraseñas no coinciden.");
    }

    // Insertar usuario
    $apellidos = $apellidoPaterno . ' ' . $apellidoMaterno;
    $sql_usuario = "INSERT INTO usuarios (nombre, apellidos, curp, telefono, correo, contrasena, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt_usuario = $conn->prepare($sql_usuario);
    $stmt_usuario->bind_param("sssssss", $nombre, $apellidos, $curp, $telefono, $correo, $password, $fecha_nacimiento);

    if ($stmt_usuario->execute()) {
        $id_usuario = $stmt_usuario->insert_id;
    } else {
        die("❌ Error al insertar usuario: " . $stmt_usuario->error);
    }
    $stmt_usuario->close();

    // Insertar dirección
    $sql_direccion = "INSERT INTO direccion (calle, numero, colonia, codigo_postal, municipio, estado) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt_direccion = $conn->prepare($sql_direccion);
    $stmt_direccion->bind_param("ssssss", $calle, $numero, $colonia, $codigo_postal, $municipio, $estado);

    if ($stmt_direccion->execute()) {
        $id_direccion = $stmt_direccion->insert_id;
    } else {
        die("❌ Error al insertar dirección: " . $stmt_direccion->error);
    }
    $stmt_direccion->close();

    // Insertar servicio
    $numero_servicio = "CFE-" . date("Y") . "-" . rand(1000, 9999);
    $tipo_servicio = "Residencial";
    $estatus = "Activo";

    $sql_servicio = "INSERT INTO servicios (numero_servicio, id_usuario, id_direccion, tipo_servicio, estatus) VALUES (?, ?, ?, ?, ?)";
    $stmt_servicio = $conn->prepare($sql_servicio);
    $stmt_servicio->bind_param("siiss", $numero_servicio, $id_usuario, $id_direccion, $tipo_servicio, $estatus);

    if (!$stmt_servicio->execute()) {
        die("❌ Error al insertar servicio: " . $stmt_servicio->error);
    }

    $stmt_servicio->close();
    $conn->close();

    // ✅ Redirección al final del proceso POST
    header("Location: /cfe/index.html");
    exit();
}
?>
