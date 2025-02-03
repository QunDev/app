/*
  Warnings:

  - You are about to drop the column `devviceId` on the `device` table. All the data in the column will be lost.
  - Added the required column `deviceId` to the `device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `devviceId`,
    ADD COLUMN `deviceId` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NULL;
