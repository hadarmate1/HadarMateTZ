-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2026. Okt 20. 10:20
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `konyvtar_db`
--
CREATE DATABASE IF NOT EXISTS `konyvtar_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `konyvtar_db`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `konyvek`
--

CREATE TABLE `konyvek` (
  `id` int(11) NOT NULL,
  `mufaj_id` int(11) DEFAULT NULL,
  `cim` varchar(150) NOT NULL,
  `kiadasi_ev` int(11) NOT NULL,
  `oldalszam` int(11) NOT NULL,
  `kolcsonozheto` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `konyvek`
--

INSERT INTO `konyvek` (`id`, `mufaj_id`, `cim`, `kiadasi_ev`, `oldalszam`, `kolcsonozheto`) VALUES
(1, 1, 'Düne krónikája', 1965, 680, 1),
(2, 1, 'Alapitvány és Birodalom', 1952, 280, 1),
(3, 1, 'Neurománc cyber trilógia', 1984, 320, 0),
(4, 2, 'A középkor alkonya', 1919, 410, 1),
(5, 2, 'Róma tündöklése és bukása', 1998, 540, 1),
(6, 2, 'Mohácsi csata oknyomozása', 2010, 190, 0),
(7, 3, 'Tíz kicsi néger rejtélye', 1939, 220, 1),
(8, 3, 'A Da Vinci-kód', 2003, 590, 1),
(9, 3, 'A sátán kutyája klasszikus', 1902, 180, 0),
(10, 1, 'Csillagközi invázió harcosai', 1959, 260, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `mufajok`
--

CREATE TABLE `mufajok` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `mufajok`
--

INSERT INTO `mufajok` (`id`, `nev`) VALUES
(3, 'Krimi'),
(1, 'Sci-fi'),
(2, 'Történelem');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `konyvek`
--
ALTER TABLE `konyvek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mufaj_id` (`mufaj_id`);

--
-- A tábla indexei `mufajok`
--
ALTER TABLE `mufajok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `konyvek`
--
ALTER TABLE `konyvek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `mufajok`
--
ALTER TABLE `mufajok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `konyvek`
--
ALTER TABLE `konyvek`
  ADD CONSTRAINT `konyvek_ibfk_1` FOREIGN KEY (`mufaj_id`) REFERENCES `mufajok` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
