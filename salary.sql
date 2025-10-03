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

 Date: 21/11/2021 17:00:27
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for salary
-- ----------------------------
DROP TABLE IF EXISTS `salary`;
CREATE TABLE `salary`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `balance` int(11) NOT NULL,
  `balance_date` datetime(0) NOT NULL,
  `created_date` datetime(0) NOT NULL,
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `branch_id` int(11) NOT NULL,
  `creator` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `employee` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '0: chua chi; 1 đã chi',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `branch_id`(`branch_id`) USING BTREE,
  INDEX `balance_date`(`balance_date`) USING BTREE,
  INDEX `employee`(`employee`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
