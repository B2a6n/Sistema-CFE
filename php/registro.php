<?php
// mostrar errores para depuración
ini_set('display_errors',1);
error_reporting(E_ALL);

require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    /* ───────── 1. CAPTURA ───────── */
    $nombre          = $_POST["nombre"]          ?? '';
    $apPat           = $_POST["apellidoPaterno"] ?? '';
    $apMat           = $_POST["apellidoMaterno"] ?? '';
    $apellidos       = trim("$apPat $apMat");
    $curp            = $_POST["curp"]            ?? '';
    $telefono        = $_POST["telefono"]        ?? '';
    $correo          = $_POST["correo"]          ?? '';
    $pass            = $_POST["password"]        ?? '';
    $confirmar       = $_POST["confirmar"]       ?? '';

    $calle           = $_POST["calle"]   ?? '';
    $numero          = $_POST["numero"]  ?? '';
    $colonia         = $_POST["colonia"] ?? '';
    $cp              = $_POST["cp"]      ?? '';
    $municipio       = $_POST["ciudad"]  ?? '';
    $estado          = $_POST["estado"]  ?? '';

    $dia  = $_POST["dia"];  $mes = $_POST["mes"];  $anio = $_POST["anio"];
    $fecha_nac = "$anio-$mes-$dia";

    /* ───────── 2. VALIDACIONES ───────── */
    if ($pass !== $confirmar) { exit("Error: contraseñas distintas"); }

    /* ───────── 3. INSERTAR USUARIO ───────── */
    $stmtU = $conn->prepare(
      "INSERT INTO usuarios
       (nombre, apellidos, curp, telefono, correo, contrasena, fecha_nacimiento)
       VALUES (?,?,?,?,?,?,?)"
    );
    $stmtU->bind_param("sssssss",
        $nombre, $apellidos, $curp, $telefono, $correo, $pass, $fecha_nac);

    if (!$stmtU->execute()) { exit("Error usuario: ".$stmtU->error); }
    $id_usuario = $stmtU->insert_id;
    $stmtU->close();

    /* ───────── 4. INSERTAR DIRECCIÓN ───────── */
    $stmtD = $conn->prepare(
      "INSERT INTO direccion
       (calle, numero, colonia, codigo_postal, municipio, estado)
       VALUES (?,?,?,?,?,?)"
    );
    $stmtD->bind_param("ssssss",
        $calle, $numero, $colonia, $cp, $municipio, $estado);

    if (!$stmtD->execute()) { exit("Error dirección: ".$stmtD->error); }
    $id_direccion = $stmtD->insert_id;
    $stmtD->close();

    /* ───────── 5. INSERTAR SERVICIO ───────── */
    $numero_servicio = "CFE-".date("Y")."-".rand(1000,9999);
    $tipo_servicio   = "Residencial";
    $estatus         = "Activo";

    $stmtS = $conn->prepare(
      "INSERT INTO servicios
       (numero_servicio, id_usuario, id_direccion, tipo_servicio, estatus)
       VALUES (?,?,?,?,?)"
    );
    $stmtS->bind_param("siiss",
        $numero_servicio, $id_usuario, $id_direccion, $tipo_servicio, $estatus);

    if (!$stmtS->execute()) { exit("Error servicio: ".$stmtS->error); }
    $stmtS->close();

    
    // (No redirigimos aún para ver el mensaje)

    $conn->close();
}
?>
