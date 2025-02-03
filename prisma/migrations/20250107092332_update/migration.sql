/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `device_deviceId_key` ON `device`(`deviceId`);
