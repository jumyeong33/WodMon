-- CreateTable
CREATE TABLE `tags` (
    `tag_uuid` VARCHAR(191) NOT NULL,
    `tag_slug` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tags_tag_slug_key`(`tag_slug`),
    PRIMARY KEY (`tag_uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wod_tag` (
    `tag_uuid` VARCHAR(191) NOT NULL,
    `wod_uuid` VARCHAR(191) NOT NULL,

    INDEX `wod_tag_wod_uuid_idx`(`wod_uuid`),
    PRIMARY KEY (`tag_uuid`, `wod_uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wod_tag` ADD CONSTRAINT `wod_tag_tag_uuid_fkey` FOREIGN KEY (`tag_uuid`) REFERENCES `tags`(`tag_uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wod_tag` ADD CONSTRAINT `wod_tag_wod_uuid_fkey` FOREIGN KEY (`wod_uuid`) REFERENCES `wods`(`wod_uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
