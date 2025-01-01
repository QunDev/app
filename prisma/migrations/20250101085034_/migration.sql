/*
  Warnings:

  - Added the required column `userId` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `phone` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `phone` DROP FOREIGN KEY `Phone_userId_fkey`;

-- DropIndex
DROP INDEX `Phone_number_key` ON `phone`;

-- DropIndex
DROP INDEX `Phone_userId_fkey` ON `phone`;

-- AlterTable
ALTER TABLE `backup` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `phone` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Phone` ADD CONSTRAINT `Phone_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Backup` ADD CONSTRAINT `Backup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
