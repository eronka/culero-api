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
