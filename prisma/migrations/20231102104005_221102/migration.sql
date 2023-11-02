/*
  Warnings:

  - Made the column `title` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "readingTime" VARCHAR(250),
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "cover" DROP NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
