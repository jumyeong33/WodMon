-- CreateTable
CREATE TABLE `wods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wod_uuid` VARCHAR(191) NOT NULL,
    `user_uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `archived_at` DATETIME(3) NULL,

    UNIQUE INDEX `wods_wod_uuid_key`(`wod_uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wods` ADD CONSTRAINT `wods_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
