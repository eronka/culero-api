-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('PENDING', 'BLOCKED', 'APPROVED');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "state" "ReviewState" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "anonymous" SET DEFAULT true;

-- CreateTable
CREATE TABLE "FavoriteReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteReview_userId_reviewId_key" ON "FavoriteReview"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "FavoriteReview" ADD CONSTRAINT "FavoriteReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteReview" ADD CONSTRAINT "FavoriteReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;


/**
 - Adds favorite review field 
 - Make the id cuid
*/
/*
  Warnings:

  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FavoriteReview" DROP CONSTRAINT "FavoriteReview_reviewId_fkey";

-- AlterTable
ALTER TABLE "FavoriteReview" ALTER COLUMN "reviewId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AddForeignKey
ALTER TABLE "FavoriteReview" ADD CONSTRAINT "FavoriteReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;


/*
 - drops 'jobTitle`. We are using `headline` instead.
*/

/*
  Warnings:

  - You are about to drop the column `jobTitle` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobTitle";
