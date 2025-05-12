/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `porblemId` on the `ProblemInPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `ProblemInPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `passsword` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playListId,problemId]` on the table `ProblemInPlaylist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `problemId` to the `ProblemInPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProblemInPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "ProblemInPlaylist" DROP CONSTRAINT "ProblemInPlaylist_porblemId_fkey";

-- DropIndex
DROP INDEX "ProblemInPlaylist_playListId_porblemId_key";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL;

-- AlterTable
ALTER TABLE "ProblemInPlaylist" DROP COLUMN "porblemId",
DROP COLUMN "updateAt",
ADD COLUMN     "problemId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passsword",
ADD COLUMN     "password" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Defficulty";

-- CreateIndex
CREATE UNIQUE INDEX "ProblemInPlaylist_playListId_problemId_key" ON "ProblemInPlaylist"("playListId", "problemId");

-- AddForeignKey
ALTER TABLE "ProblemInPlaylist" ADD CONSTRAINT "ProblemInPlaylist_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
