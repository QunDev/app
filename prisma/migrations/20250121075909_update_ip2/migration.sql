-- DropIndex
DROP INDEX `Ip_ip_key` ON `ip`;

-- AlterTable
ALTER TABLE `ip` ADD COLUMN `countUsed` INTEGER NOT NULL DEFAULT 0;
