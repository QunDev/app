-- AlterTable
ALTER TABLE `countryphone` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CountryPhone` ADD CONSTRAINT `CountryPhone_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
