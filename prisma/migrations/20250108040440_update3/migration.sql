/*
  Warnings:

  - You are about to drop the column `is_active` on the `interacts` table. All the data in the column will be lost.
  - You are about to drop the column `interactScriptId` on the `script` table. All the data in the column will be lost.
  - You are about to drop the `interactscript` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `interactscript` DROP FOREIGN KEY `interactScript_appId_fkey`;

-- DropForeignKey
ALTER TABLE `interactscript` DROP FOREIGN KEY `interactScript_interactsId_fkey`;

-- DropForeignKey
ALTER TABLE `interactscript` DROP FOREIGN KEY `interactScript_userId_fkey`;

-- DropForeignKey
ALTER TABLE `script` DROP FOREIGN KEY `Script_interactScriptId_fkey`;

-- DropIndex
DROP INDEX `Script_interactScriptId_fkey` ON `script`;

-- DropIndex
DROP INDEX `User_email_idx` ON `user`;

-- AlterTable
ALTER TABLE `interacts` DROP COLUMN `is_active`,
    ADD COLUMN `is_start` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `script` DROP COLUMN `interactScriptId`,
    ADD COLUMN `interactId` INTEGER NULL;

-- DropTable
DROP TABLE `interactscript`;

-- AddForeignKey
ALTER TABLE `Script` ADD CONSTRAINT `Script_interactId_fkey` FOREIGN KEY (`interactId`) REFERENCES `interacts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
