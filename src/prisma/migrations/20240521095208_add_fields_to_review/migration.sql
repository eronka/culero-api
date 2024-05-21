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
