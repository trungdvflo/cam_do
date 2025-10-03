/*
 Navicat Premium Data Transfer

 Source Server         : localhost MariaDB
 Source Server Type    : MariaDB
 Source Server Version : 100125
 Source Host           : localhost:3306
 Source Schema         : new_pro

 Target Server Type    : MariaDB
 Target Server Version : 100125
 File Encoding         : 65001

 Date: 13/08/2021 21:12:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for report_closed
-- ----------------------------
DROP TABLE IF EXISTS `report_closed`;
CREATE TABLE `report_closed`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report_date` date NOT NULL,
  `money_in` int(11) NOT NULL DEFAULT 0,
  `money_out` int(11) NOT NULL DEFAULT 0,
  `money_balance` int(11) NOT NULL DEFAULT 0,
  `created_date` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
