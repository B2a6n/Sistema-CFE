-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 17, 2025 at 04:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistema_servicios`
--

-- --------------------------------------------------------

--
-- Table structure for table `direccion`
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
-- Dumping data for table `direccion`
--

INSERT INTO `direccion` (`id_direccion`, `calle`, `numero`, `colonia`, `codigo_postal`, `municipio`, `estado`) VALUES
(20, 'Arroyo', '4B', 'La Cima', '91637', 'Xalapa', 'Veracruz'),
(21, 'Arroyo', '9212075738', 'La Cima', '91637', 'Xalapa', 'Veracruz'),
(22, 'Mendez Espinoza', 'ksns', 'El sumidero', 'dnc99', 'Zacoapan', 'Veracruz'),
(23, 'Benito', '169', 'Parada', '111111', 'Washington', 'Veracruz');

-- --------------------------------------------------------

--
-- Table structure for table `reportes`
--

CREATE TABLE `reportes` (
  `id_reporte` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `tipo_falla` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL,
  `fecha_reporte` date NOT NULL,
  `descripcion` text NOT NULL,
  `estatus` varchar(50) DEFAULT 'Pendiente',
  `fecha_atencion` date DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `id_supervisor` int(11) DEFAULT NULL,
  `estatus_tecnico` enum('Pendiente','En Proceso','En Revisión','Finalizado') DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reportes`
--

INSERT INTO `reportes` (`id_reporte`, `id_servicio`, `tipo_falla`, `ubicacion`, `fecha_reporte`, `descripcion`, `estatus`, `fecha_atencion`, `id_tecnico`, `id_supervisor`, `estatus_tecnico`) VALUES
(7, 22, 'Apagón', 'Fraccionamiento La Cima Calle Arroyo 4B', '2025-07-16', 'Apagon en la primera calle', 'Finalizado', NULL, NULL, NULL, 'Pendiente');

-- --------------------------------------------------------

--
-- Table structure for table `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `num_contrato` varchar(25) NOT NULL,
  `id_direccion` int(11) NOT NULL,
  `tipo_servicio` varchar(100) DEFAULT 'Residencial',
  `estatus` varchar(50) DEFAULT 'Activo',
  `num_medidor` varchar(25) NOT NULL,
  `num_servicio` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `id_usuario`, `num_contrato`, `id_direccion`, `tipo_servicio`, `estatus`, `num_medidor`, `num_servicio`) VALUES
(22, 31, '763871', 20, 'Residencial', 'Activo', '2332333', '23237638'),
(23, 33, 'ncxhsk', 22, 'Residencial', 'Activo', 'MED28379', 'jnsdbd'),
(24, 34, '0100', 23, 'Residencial', 'Activo', 'MED6969', '33333');

-- --------------------------------------------------------

--
-- Table structure for table `supervisor`
--

CREATE TABLE `supervisor` (
  `id_supervisor` int(11) NOT NULL,
  `supervisor` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tecnico`
--

CREATE TABLE `tecnico` (
  `id_tecnico` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especialidad` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
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
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellidos`, `curp`, `telefono`, `correo`, `contrasena`, `fecha_nacimiento`) VALUES
(31, 'Jaciel', 'Martinez Benitez', 'MABJ041117HVZRNCA1', '9219223834', 'martineztoby118@gmail.com', '190300', '2004-11-17'),
(33, 'Luis', 'Olivo', 'MABJ041117HVZRNCA1', 'kdnijdk', 'lkcejnncdi@gmail.com', '111111', '1995-01-28'),
(34, 'Jose', 'Morales', 'MODS1865BBKHBSDF', '2283145914', 'papitochulo@ahorita.com', '1qw23er4', '2001-09-12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id_direccion`);

--
-- Indexes for table `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `id_servicio` (`id_servicio`),
  ADD KEY `id_tecnico` (`id_tecnico`),
  ADD KEY `id_supervisor` (`id_supervisor`);

--
-- Indexes for table `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD UNIQUE KEY `numero_contrato` (`num_contrato`),
  ADD UNIQUE KEY `numero_contrato_2` (`num_contrato`),
  ADD UNIQUE KEY `uq_num_contrato` (`num_contrato`),
  ADD UNIQUE KEY `uq_num_servicio` (`num_servicio`),
  ADD UNIQUE KEY `uq_num_medidor` (`num_medidor`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_direccion` (`id_direccion`);

--
-- Indexes for table `supervisor`
--
ALTER TABLE `supervisor`
  ADD PRIMARY KEY (`id_supervisor`);

--
-- Indexes for table `tecnico`
--
ALTER TABLE `tecnico`
  ADD PRIMARY KEY (`id_tecnico`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `supervisor`
--
ALTER TABLE `supervisor`
  MODIFY `id_supervisor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tecnico`
--
ALTER TABLE `tecnico`
  MODIFY `id_tecnico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`),
  ADD CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnico` (`id_tecnico`),
  ADD CONSTRAINT `reportes_ibfk_3` FOREIGN KEY (`id_supervisor`) REFERENCES `supervisor` (`id_supervisor`);

--
-- Constraints for table `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `servicios_ibfk_2` FOREIGN KEY (`id_direccion`) REFERENCES `direccion` (`id_direccion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
