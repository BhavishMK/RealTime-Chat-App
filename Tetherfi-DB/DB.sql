-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: tetherfichatdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SenderId` int NOT NULL,
  `ReceiverId` int NOT NULL,
  `Content` text NOT NULL,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `ReplyToMessageId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `SenderId` (`SenderId`),
  KEY `ReceiverId` (`ReceiverId`),
  KEY `ReplyToMessageId` (`ReplyToMessageId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`SenderId`) REFERENCES `users` (`Id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`ReceiverId`) REFERENCES `users` (`Id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`ReplyToMessageId`) REFERENCES `messages` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,7,8,'dd','2026-01-09 07:56:13',NULL),(2,1,3,'hj','2026-01-09 08:09:52',NULL),(3,1,8,'huu','2026-01-09 08:10:28',NULL),(4,8,1,'hiiii','2026-01-09 08:11:17',NULL),(5,8,1,'how areay','2026-01-09 08:11:24',NULL),(6,1,8,'ji','2026-01-09 08:12:15',NULL),(7,1,8,'j','2026-01-09 09:06:31',NULL),(8,1,1,'nnn','2026-01-09 09:07:07',NULL),(9,1,1,'jjjjj','2026-01-09 09:07:11',NULL),(10,1,1,'sss','2026-01-09 09:07:17',NULL),(11,1,8,'xx','2026-01-09 09:07:31',NULL),(12,8,1,'xxss','2026-01-09 09:07:45',NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Status` varchar(20) DEFAULT 'Available',
  `LastSeen` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','$2a$11$mosobqK76BvbrKr2/2rN9uJxjcIR/wWJ/kzVU7FcoGHGQISV9cmVO','Offline','2026-01-09 03:44:15'),(2,'test','$2a$11$1ARrG/cZj.sAmuouQ2.OLOOV1sbj/eESpFcFaGv3QBbdBHMo/2dme','Available','2026-01-09 05:10:42'),(3,'John_Doe','hashed_password_here','Available','2026-01-09 11:43:56'),(4,'Jane_Smith','hashed_password_here','Busy','2026-01-09 11:43:56'),(5,'Mike_Tetherfi','hashed_password_here','Away','2026-01-09 11:43:56'),(6,'Sarah_Lead','hashed_password_here','Offline','2026-01-09 11:43:56'),(7,'Akshay','$2a$11$OaILA.3qWlg3HZtXvwKRD.arGrjNlbGBeiZZOM8orTcvupqtsTHwK','Offline','2026-01-09 06:58:14'),(8,'Bhavish','$2a$11$Ehqe99yrs2Y72tpRvAu6ROKHmuZUi7KDWkUk3JuRmlkbspgr/wdYO','Available','2026-01-09 06:58:38'),(9,'string','$2a$11$dx/loHsenTibxzolwMLVreF/W2Gb5MtQoklPQK2LirTyDx5IRo/VO','Available','2026-01-09 07:02:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'tetherfichatdb'
--

--
-- Dumping routines for database 'tetherfichatdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-09 14:42:05
