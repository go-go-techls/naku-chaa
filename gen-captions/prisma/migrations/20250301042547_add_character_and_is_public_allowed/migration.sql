-- AlterTable
ALTER TABLE "Art" ADD COLUMN     "character" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "is_public_allowed" BOOLEAN NOT NULL DEFAULT false;
