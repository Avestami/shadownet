/*
  Warnings:

  - The `karma` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "availableKarmaChoices" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "documents" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "hints" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "narrative" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentLevel" TEXT NOT NULL DEFAULT 'alpha',
DROP COLUMN "karma",
ADD COLUMN     "karma" JSONB NOT NULL DEFAULT '{"loyalty": 0, "defiance": 0, "mercy": 0, "curiosity": 0, "integration": 0}';

-- CreateTable
CREATE TABLE "KarmaChoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "karmaType" TEXT NOT NULL,
    "karmaValue" INTEGER NOT NULL,
    "choiceText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KarmaChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioFile" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "description" TEXT,
    "frequency" DOUBLE PRECISION,
    "isCorrupted" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AudioFile_levelId_filename_key" ON "AudioFile"("levelId", "filename");

-- AddForeignKey
ALTER TABLE "KarmaChoice" ADD CONSTRAINT "KarmaChoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KarmaChoice" ADD CONSTRAINT "KarmaChoice_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
