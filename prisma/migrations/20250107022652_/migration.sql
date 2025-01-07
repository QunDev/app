/*
  Warnings:

  - Added the required column `updatedAt` to the `Backup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `apikey` DROP FOREIGN KEY `ApiKey_appId_fkey`;

-- DropIndex
DROP INDEX `ApiKey_appId_fkey` ON `apikey`;

-- AlterTable
ALTER TABLE `backup` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
