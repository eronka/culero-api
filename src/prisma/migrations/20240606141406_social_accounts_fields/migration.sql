-- AlterTable
ALTER TABLE "SocialAccount" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "pictureUrl" TEXT,
ADD COLUMN     "socialId" TEXT,
ALTER COLUMN "profileUrl" DROP NOT NULL;
