-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('GOOGLE', 'APPLE', 'FACEBOOK', 'LINKEDIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "profilePictureUrl" TEXT,
    "authType" "AuthType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
