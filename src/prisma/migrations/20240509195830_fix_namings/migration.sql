/*
  Warnings:

  - You are about to drop the column `ratedUserId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `raterUserId` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `postedToId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;


-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_ratedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_raterUserId_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "ratedUserId",
DROP COLUMN "raterUserId",
ADD COLUMN     "postedById" TEXT,
ADD COLUMN     "postedToId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_postedToId_fkey" FOREIGN KEY ("postedToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
