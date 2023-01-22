-- AlterTable
ALTER TABLE `comments` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `title` TEXT NOT NULL,
    MODIFY `decription` TEXT NOT NULL;
