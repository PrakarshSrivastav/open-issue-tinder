/*
  Warnings:

  - Added the required column `author` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorAvatarUrl` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorUrl` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "authorAvatarUrl" TEXT NOT NULL,
ADD COLUMN     "authorUrl" TEXT NOT NULL;
