/*
  Warnings:

  - You are about to drop the column `token` on the `EmailVerificationToken` table. All the data in the column will be lost.
  - Added the required column `otp` to the `EmailVerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EmailVerificationToken_token_key";

-- AlterTable
ALTER TABLE "EmailVerificationToken" DROP COLUMN "token",
ADD COLUMN     "otp" TEXT NOT NULL;
