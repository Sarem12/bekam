/*
  Warnings:

  - The `status` column on the `UserAnalogy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[AnalogyId]` on the table `DefaultAnalogy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ParagraphId]` on the table `DefaultParagraph` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[SummeryId]` on the table `DefaultSummery` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[KeyWordsId]` on the table `KeyWordDefault` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[NoteId]` on the table `NoteDefault` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('liked', 'disliked', 'neutral');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Analogy" ADD COLUMN     "defaultAnalogyId" TEXT;

-- AlterTable
ALTER TABLE "KeyWords" ADD COLUMN     "defaultKeywordsId" TEXT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "defaultNoteId" TEXT;

-- AlterTable
ALTER TABLE "Paragraph" ADD COLUMN     "defaultParagraphId" TEXT;

-- AlterTable
ALTER TABLE "RealParagraph" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Summery" ADD COLUMN     "defaultSummeryId" TEXT;

-- AlterTable
ALTER TABLE "TagRelatorAnalogy" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorKeyWords" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorNote" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorParagraph" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorSummery" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "UserAnalogy" ADD COLUMN     "flaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" "ActionStatus" NOT NULL DEFAULT 'neutral';

-- AlterTable
ALTER TABLE "UserKeyWords" ADD COLUMN     "flaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ActionStatus" NOT NULL DEFAULT 'neutral';

-- AlterTable
ALTER TABLE "UserNote" ADD COLUMN     "flaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ActionStatus" NOT NULL DEFAULT 'neutral';

-- AlterTable
ALTER TABLE "UserParagraph" ADD COLUMN     "flaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ActionStatus" NOT NULL DEFAULT 'neutral';

-- AlterTable
ALTER TABLE "UserSummery" ADD COLUMN     "flaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ActionStatus" NOT NULL DEFAULT 'neutral';

-- CreateTable
CREATE TABLE "UniversalTag" (
    "id" TEXT NOT NULL,
    "tagID" TEXT NOT NULL,

    CONSTRAINT "UniversalTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UniversalTag_tagID_key" ON "UniversalTag"("tagID");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultAnalogy_AnalogyId_key" ON "DefaultAnalogy"("AnalogyId");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultParagraph_ParagraphId_key" ON "DefaultParagraph"("ParagraphId");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultSummery_SummeryId_key" ON "DefaultSummery"("SummeryId");

-- CreateIndex
CREATE UNIQUE INDEX "KeyWordDefault_KeyWordsId_key" ON "KeyWordDefault"("KeyWordsId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteDefault_NoteId_key" ON "NoteDefault"("NoteId");

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_ParentLessonId_fkey" FOREIGN KEY ("ParentLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversalTag" ADD CONSTRAINT "UniversalTag_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analogy" ADD CONSTRAINT "Analogy_defaultAnalogyId_fkey" FOREIGN KEY ("defaultAnalogyId") REFERENCES "DefaultAnalogy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_defaultParagraphId_fkey" FOREIGN KEY ("defaultParagraphId") REFERENCES "DefaultParagraph"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summery" ADD CONSTRAINT "Summery_defaultSummeryId_fkey" FOREIGN KEY ("defaultSummeryId") REFERENCES "DefaultSummery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyWords" ADD CONSTRAINT "KeyWords_defaultKeywordsId_fkey" FOREIGN KEY ("defaultKeywordsId") REFERENCES "KeyWordDefault"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_defaultNoteId_fkey" FOREIGN KEY ("defaultNoteId") REFERENCES "NoteDefault"("id") ON DELETE SET NULL ON UPDATE CASCADE;
