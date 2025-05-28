/*
  Warnings:

  - A unique constraint covering the columns `[userTestResultId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "userTestResultId" TEXT;

-- AlterTable
ALTER TABLE "TestCaseResult" ADD COLUMN     "userTestResultId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_userTestResultId_key" ON "Submission"("userTestResultId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userTestResultId_fkey" FOREIGN KEY ("userTestResultId") REFERENCES "UserTestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseResult" ADD CONSTRAINT "TestCaseResult_userTestResultId_fkey" FOREIGN KEY ("userTestResultId") REFERENCES "UserTestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
