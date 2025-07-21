-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 21-07-2025 a las 19:17:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_servicios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id_direccion` int(11) NOT NULL,
  `calle` varchar(100) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `colonia` varchar(100) NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `municipio` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`id_direccion`, `calle`, `numero`, `colonia`, `codigo_postal`, `municipio`, `estado`) VALUES
(24, 'Arroyo', '4B', 'La Cima', '91637', 'Xalapa', 'Veracruz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `folio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_falla` varchar(100) DEFAULT NULL,
  `fecha_reporte` date NOT NULL,
  `descripcion` text NOT NULL,
  `estatus` varchar(50) DEFAULT 'Pendiente',
  `fecha_atencion` date DEFAULT NULL,
  `calle` varchar(100) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `referencias` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`folio`, `id_usuario`, `tipo_falla`, `fecha_reporte`, `descripcion`, `estatus`, `fecha_atencion`, `calle`, `numero`, `colonia`, `municipio`, `codigo_postal`, `referencias`) VALUES
(14, 35, 'Apagón', '2025-07-17', 'ninguna', 'Pendiente', NULL, 'Arroyo', '4B', 'La Cima', 'Xalapa', '91637', 'Entre Colina y La Cima'),
(15, 35, 'Apagón', '2025-07-17', 'ninguna', 'Pendiente', NULL, 'Arroyo', '5b', 'La Cima', 'Xalapa', '23167', 'Entre Colina y La Cima'),
(16, 35, 'Apagón', '2025-07-17', 'se fue la luz', 'Pendiente', NULL, 'Gustavo Diaz Ordaz', '12', 'El castillo', 'xalapa', '91667', 'frente al salon del pueblo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte_proceso`
--

CREATE TABLE `reporte_proceso` (
  `id` int(11) NOT NULL,
  `folio` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `tipo_falla` varchar(100) DEFAULT NULL,
  `fecha_reporte` date DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estatus` varchar(50) DEFAULT 'En Proceso',
  `fecha_asignacion` datetime DEFAULT NULL,
  `calle` varchar(100) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `referencias` text DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `nombre_tecnico` varchar(100) DEFAULT NULL,
  `especialidad_tecnico` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `num_contrato` varchar(25) NOT NULL,
  `id_direccion` int(11) NOT NULL,
  `tipo_servicio` varchar(100) DEFAULT 'Residencial',
  `estatus` varchar(50) DEFAULT 'Activo',
  `num_medidor` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `id_usuario`, `num_contrato`, `id_direccion`, `tipo_servicio`, `estatus`, `num_medidor`) VALUES
(25, 35, '763871', 24, 'Residencial', 'Activo', 'MED28379');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supervisor`
--

CREATE TABLE `supervisor` (
  `id_supervisor` int(11) NOT NULL,
  `supervisor` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico`
--

CREATE TABLE `tecnico` (
  `id_tecnico` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especialidad` varchar(100) NOT NULL,
  `estatus` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tecnico`
--

INSERT INTO `tecnico` (`id_tecnico`, `nombre`, `especialidad`, `estatus`) VALUES
(9892, 'Manuel Rivera', 'Reconexion de redes', 'Disponible'),
(98546, 'Luis Navas', 'Cableado estructural', 'Indispuesto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellidos`, `curp`, `telefono`, `correo`, `contrasena`, `fecha_nacimiento`) VALUES
(35, 'Jaciel', 'Martinez Benitez', 'MABJ041117HVZRNCA1', '9212075738', 'martineztoby118@gmail.com', '137980', '2004-11-17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id_direccion`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`folio`);

--
-- Indices de la tabla `reporte_proceso`
--
ALTER TABLE `reporte_proceso`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD UNIQUE KEY `numero_contrato` (`num_contrato`),
  ADD UNIQUE KEY `numero_contrato_2` (`num_contrato`),
  ADD UNIQUE KEY `uq_num_contrato` (`num_contrato`),
  ADD UNIQUE KEY `uq_num_medidor` (`num_medidor`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_direccion` (`id_direccion`);

--
-- Indices de la tabla `supervisor`
--
ALTER TABLE `supervisor`
  ADD PRIMARY KEY (`id_supervisor`);

--
-- Indices de la tabla `tecnico`
--
ALTER TABLE `tecnico`
  ADD PRIMARY KEY (`id_tecnico`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `reporte_proceso`
--
ALTER TABLE `reporte_proceso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `supervisor`
--
ALTER TABLE `supervisor`
  MODIFY `id_supervisor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tecnico`
--
ALTER TABLE `tecnico`
  MODIFY `id_tecnico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98547;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `servicios_ibfk_2` FOREIGN KEY (`id_direccion`) REFERENCES `direccion` (`id_direccion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
