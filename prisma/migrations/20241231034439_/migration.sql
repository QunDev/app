-- AlterTable
ALTER TABLE `permission` ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `updatedBy` INTEGER NULL;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `updatedBy` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `updatedBy` INTEGER NULL;
