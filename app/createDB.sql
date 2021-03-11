CREATE SCHEMA IF NOT EXISTS `ProjectAl`;
USE `ProjectAl`;

CREATE TABLE IF NOT EXISTS `Courses` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL,
  `code` varchar(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Assignments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `testsuitePath` varchar(1024) NOT NULL,
  `course` int NOT NULL,
  `name` text NOT NULL,
  `duedate` datetime
);

CREATE TABLE IF NOT EXISTS `Submissions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `assignment` int NOT NULL,
  `user` int NOT NULL,
  `grade` text,
  `feedback` text,
  `filepath` varchar(1024),
  `testStatus` varchar(15) NOT NULL DEFAULT 'Pending',
  `dateAdded` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `AllowedFileFormats` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `aid` int NOT NULL,
  `extension` text NOT NULL
);

CREATE TABLE IF NOT EXISTS `CourseParticipants` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `uid` int NOT NULL,
  `cid` int NOT NULL
);

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(128) UNIQUE NOT NULL,
  `email` varchar(512) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `RoleClaims` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user` int NOT NULL,
  `course` int
);

CREATE TABLE IF NOT EXISTS `Roles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL
);

ALTER TABLE `AllowedFileFormats` ADD FOREIGN KEY (`aid`) REFERENCES `Assignments` (`id`);
ALTER TABLE `CourseParticipants` ADD FOREIGN KEY (`uid`) REFERENCES `Users` (`id`);
ALTER TABLE `CourseParticipants` ADD FOREIGN KEY (`cid`) REFERENCES `Courses` (`id`);
ALTER TABLE `Assignments` ADD FOREIGN KEY (`course`) REFERENCES `Courses` (`id`);
ALTER TABLE `RoleClaims` ADD FOREIGN KEY (`user`) REFERENCES `Users` (`id`);
ALTER TABLE `RoleClaims` ADD FOREIGN KEY (`id`) REFERENCES `Roles` (`id`);
ALTER TABLE `RoleClaims` ADD FOREIGN KEY (`course`) REFERENCES `Courses` (`id`);
ALTER TABLE `Submissions` ADD FOREIGN KEY (`assignment`) REFERENCES `Assignments` (`id`);
ALTER TABLE `Submissions` ADD FOREIGN KEY (`user`) REFERENCES `Users` (`id`);
