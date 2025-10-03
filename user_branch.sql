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

 Date: 28/02/2022 17:16:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_branch
-- ----------------------------
DROP TABLE IF EXISTS `user_branch`;
CREATE TABLE `user_branch`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `branch_id`(`branch_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
