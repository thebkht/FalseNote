-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "githubId" TEXT,
ALTER COLUMN "username" DROP NOT NULL;
