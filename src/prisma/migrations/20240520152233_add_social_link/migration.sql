/*
  Warnings:

  - You are about to drop the `LinkedSocialAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSocialAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialAccountType" AS ENUM ('LINKEDIN', 'GITHUB', 'TWITTER', 'FACEBOOK', 'GITLAB');

-- AlterEnum
ALTER TYPE "AuthType" ADD VALUE 'EXTERNAL';

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_followingId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedSocialAccount" DROP CONSTRAINT "LinkedSocialAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSocialAccount" DROP CONSTRAINT "UserSocialAccount_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "LinkedSocialAccount";

-- DropTable
DROP TABLE "UserSocialAccount";

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" SERIAL NOT NULL,
    "platform" "SocialAccountType" NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "addedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialAccount_userId_platform_profileUrl_idx" ON "SocialAccount"("userId", "platform", "profileUrl");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
