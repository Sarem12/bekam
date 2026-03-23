/*
  Warnings:

  - You are about to drop the column `defaultAnalogyId` on the `Analogy` table. All the data in the column will be lost.
  - You are about to drop the column `currentAnalogyId` on the `DefaultAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `realParagraphId` on the `DefaultAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `DefaultAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `currentParagraphId` on the `DefaultParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `realParagraphId` on the `DefaultParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `DefaultParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `currentKeyWordsId` on the `KeyWordDefault` table. All the data in the column will be lost.
  - You are about to drop the column `realParagraphId` on the `KeyWordDefault` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `KeyWordDefault` table. All the data in the column will be lost.
  - You are about to drop the column `defaultKeyWordId` on the `KeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `parentLessonId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `defaultNoteId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `currentNoteId` on the `NoteDefault` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `NoteDefault` table. All the data in the column will be lost.
  - You are about to drop the column `defaultParagraphId` on the `Paragraph` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Paragraph` table. All the data in the column will be lost.
  - You are about to drop the column `analogyId` on the `TagRelatorAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `TagRelatorAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `keywordsId` on the `TagRelatorKeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `TagRelatorKeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `noteId` on the `TagRelatorNote` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `TagRelatorNote` table. All the data in the column will be lost.
  - You are about to drop the column `paragraphId` on the `TagRelatorParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `TagRelatorParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `uiSettings` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `analogyId` on the `UserAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `flagged` on the `UserAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `UserAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `onUse` on the `UserAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `skipped` on the `UserAnalogy` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserAnalogy` table. All the data in the column will be lost.
  - The `status` column on the `UserAnalogy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `keywordsId` on the `UserKeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `UserKeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserKeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserKeyWords` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `UserNote` table. All the data in the column will be lost.
  - You are about to drop the column `noteId` on the `UserNote` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserNote` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserNote` table. All the data in the column will be lost.
  - You are about to drop the column `flagged` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `onUse` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `paragraphId` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `skipped` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `UserTag` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserTag` table. All the data in the column will be lost.
  - You are about to drop the `Box` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DefaultSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KeyWord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RealParagraph` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Summary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagRelatorSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UniversalTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSummary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `AnalogyId` to the `DefaultAnalogy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `DefaultAnalogy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LessonId` to the `DefaultParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ParagraphId` to the `DefaultParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RealParagraphId` to the `DefaultParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `DefaultParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `KeyWordsId` to the `KeyWordDefault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `KeyWordDefault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LessonId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LessonId` to the `NoteDefault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NoteId` to the `NoteDefault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UnitId` to the `NoteDefault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `NoteDefault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LessonId` to the `Paragraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MasterParagraphId` to the `Paragraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AnalogyId` to the `TagRelatorAnalogy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TagId` to the `TagRelatorAnalogy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `KeyWordsId` to the `TagRelatorKeyWords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TagId` to the `TagRelatorKeyWords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NoteId` to the `TagRelatorNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TagId` to the `TagRelatorNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ParagraphId` to the `TagRelatorParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TagId` to the `TagRelatorParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BookId` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `AnalogyId` to the `UserAnalogy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `UserAnalogy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `KeyWordsId` to the `UserKeyWords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `UserKeyWords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NoteId` to the `UserNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `UserNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ParagraphId` to the `UserParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `UserParagraph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TagId` to the `UserTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `UserTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analogy" DROP CONSTRAINT "Analogy_defaultAnalogyId_fkey";

-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_realParagraphId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultAnalogy" DROP CONSTRAINT "DefaultAnalogy_currentAnalogyId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultAnalogy" DROP CONSTRAINT "DefaultAnalogy_realParagraphId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultAnalogy" DROP CONSTRAINT "DefaultAnalogy_userId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultParagraph" DROP CONSTRAINT "DefaultParagraph_currentParagraphId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultParagraph" DROP CONSTRAINT "DefaultParagraph_realParagraphId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultParagraph" DROP CONSTRAINT "DefaultParagraph_userId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultSummary" DROP CONSTRAINT "DefaultSummary_currentSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultSummary" DROP CONSTRAINT "DefaultSummary_unitId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultSummary" DROP CONSTRAINT "DefaultSummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "KeyWord" DROP CONSTRAINT "KeyWord_keywordsId_fkey";

-- DropForeignKey
ALTER TABLE "KeyWordDefault" DROP CONSTRAINT "KeyWordDefault_currentKeyWordsId_fkey";

-- DropForeignKey
ALTER TABLE "KeyWordDefault" DROP CONSTRAINT "KeyWordDefault_realParagraphId_fkey";

-- DropForeignKey
ALTER TABLE "KeyWordDefault" DROP CONSTRAINT "KeyWordDefault_userId_fkey";

-- DropForeignKey
ALTER TABLE "KeyWords" DROP CONSTRAINT "KeyWords_defaultKeyWordId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_parentLessonId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_defaultNoteId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "NoteDefault" DROP CONSTRAINT "NoteDefault_currentNoteId_fkey";

-- DropForeignKey
ALTER TABLE "NoteDefault" DROP CONSTRAINT "NoteDefault_userId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_defaultParagraphId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "RealParagraph" DROP CONSTRAINT "RealParagraph_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_defaultSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_unitId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorAnalogy" DROP CONSTRAINT "TagRelatorAnalogy_analogyId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorAnalogy" DROP CONSTRAINT "TagRelatorAnalogy_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorKeyWords" DROP CONSTRAINT "TagRelatorKeyWords_keywordsId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorKeyWords" DROP CONSTRAINT "TagRelatorKeyWords_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorNote" DROP CONSTRAINT "TagRelatorNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorNote" DROP CONSTRAINT "TagRelatorNote_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorParagraph" DROP CONSTRAINT "TagRelatorParagraph_paragraphId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorParagraph" DROP CONSTRAINT "TagRelatorParagraph_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorSummary" DROP CONSTRAINT "TagRelatorSummary_summaryId_fkey";

-- DropForeignKey
ALTER TABLE "TagRelatorSummary" DROP CONSTRAINT "TagRelatorSummary_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UniversalTag" DROP CONSTRAINT "UniversalTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserAnalogy" DROP CONSTRAINT "UserAnalogy_analogyId_fkey";

-- DropForeignKey
ALTER TABLE "UserAnalogy" DROP CONSTRAINT "UserAnalogy_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserKeyWords" DROP CONSTRAINT "UserKeyWords_keywordsId_fkey";

-- DropForeignKey
ALTER TABLE "UserKeyWords" DROP CONSTRAINT "UserKeyWords_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserNote" DROP CONSTRAINT "UserNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "UserNote" DROP CONSTRAINT "UserNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserParagraph" DROP CONSTRAINT "UserParagraph_paragraphId_fkey";

-- DropForeignKey
ALTER TABLE "UserParagraph" DROP CONSTRAINT "UserParagraph_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSummary" DROP CONSTRAINT "UserSummary_summaryId_fkey";

-- DropForeignKey
ALTER TABLE "UserSummary" DROP CONSTRAINT "UserSummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_userId_fkey";

-- DropIndex
DROP INDEX "DefaultAnalogy_currentAnalogyId_key";

-- DropIndex
DROP INDEX "DefaultParagraph_currentParagraphId_key";

-- DropIndex
DROP INDEX "KeyWordDefault_currentKeyWordsId_key";

-- DropIndex
DROP INDEX "NoteDefault_currentNoteId_key";

-- AlterTable
ALTER TABLE "Analogy" DROP COLUMN "defaultAnalogyId",
ADD COLUMN     "RealParagraphId" TEXT;

-- AlterTable
ALTER TABLE "DefaultAnalogy" DROP COLUMN "currentAnalogyId",
DROP COLUMN "realParagraphId",
DROP COLUMN "userId",
ADD COLUMN     "AnalogyId" TEXT NOT NULL,
ADD COLUMN     "RealParagraphId" TEXT,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "lessonId" TEXT;

-- AlterTable
ALTER TABLE "DefaultParagraph" DROP COLUMN "currentParagraphId",
DROP COLUMN "realParagraphId",
DROP COLUMN "userId",
ADD COLUMN     "LessonId" TEXT NOT NULL,
ADD COLUMN     "ParagraphId" TEXT NOT NULL,
ADD COLUMN     "RealParagraphId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "KeyWordDefault" DROP COLUMN "currentKeyWordsId",
DROP COLUMN "realParagraphId",
DROP COLUMN "userId",
ADD COLUMN     "KeyWordsId" TEXT NOT NULL,
ADD COLUMN     "RealParagraphId" TEXT,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "lessonId" TEXT;

-- AlterTable
ALTER TABLE "KeyWords" DROP COLUMN "defaultKeyWordId",
ADD COLUMN     "RealParagraphId" TEXT,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "parentLessonId",
ADD COLUMN     "ParentLessonId" TEXT;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "defaultNoteId",
DROP COLUMN "lessonId",
DROP COLUMN "userId",
ADD COLUMN     "LessonId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "NoteDefault" DROP COLUMN "currentNoteId",
DROP COLUMN "userId",
ADD COLUMN     "LessonId" TEXT NOT NULL,
ADD COLUMN     "NoteId" TEXT NOT NULL,
ADD COLUMN     "UnitId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "defaultParagraphId",
DROP COLUMN "lessonId",
ADD COLUMN     "LessonId" TEXT NOT NULL,
ADD COLUMN     "MasterParagraphId" TEXT NOT NULL,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorAnalogy" DROP COLUMN "analogyId",
DROP COLUMN "tagId",
ADD COLUMN     "AnalogyId" TEXT NOT NULL,
ADD COLUMN     "TagId" TEXT NOT NULL,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorKeyWords" DROP COLUMN "keywordsId",
DROP COLUMN "tagId",
ADD COLUMN     "KeyWordsId" TEXT NOT NULL,
ADD COLUMN     "TagId" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorNote" DROP COLUMN "noteId",
DROP COLUMN "tagId",
ADD COLUMN     "NoteId" TEXT NOT NULL,
ADD COLUMN     "TagId" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TagRelatorParagraph" DROP COLUMN "paragraphId",
DROP COLUMN "tagId",
ADD COLUMN     "ParagraphId" TEXT NOT NULL,
ADD COLUMN     "TagId" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "bookId",
ADD COLUMN     "BookId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uiSettings",
ADD COLUMN     "UISettings" JSONB,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserAnalogy" DROP COLUMN "analogyId",
DROP COLUMN "flagged",
DROP COLUMN "lastSeen",
DROP COLUMN "onUse",
DROP COLUMN "skipped",
DROP COLUMN "userId",
ADD COLUMN     "AnalogyId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "skiped" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'neutral';

-- AlterTable
ALTER TABLE "UserKeyWords" DROP COLUMN "keywordsId",
DROP COLUMN "lastSeen",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "KeyWordsId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "skiped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserNote" DROP COLUMN "lastSeen",
DROP COLUMN "noteId",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "NoteId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "skiped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserParagraph" DROP COLUMN "flagged",
DROP COLUMN "lastSeen",
DROP COLUMN "onUse",
DROP COLUMN "paragraphId",
DROP COLUMN "skipped",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "ParagraphId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD COLUMN     "skiped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserTag" DROP COLUMN "tagId",
DROP COLUMN "userId",
ADD COLUMN     "TagId" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL,
ALTER COLUMN "likingLevel" SET DEFAULT 0,
ALTER COLUMN "likingLevel" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Box";

-- DropTable
DROP TABLE "DefaultSummary";

-- DropTable
DROP TABLE "KeyWord";

-- DropTable
DROP TABLE "RealParagraph";

-- DropTable
DROP TABLE "Summary";

-- DropTable
DROP TABLE "TagRelatorSummary";

-- DropTable
DROP TABLE "UniversalTag";

-- DropTable
DROP TABLE "UserSummary";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Summery" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "LessonId" TEXT,
    "UnitId" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "usage" INTEGER NOT NULL DEFAULT 0,
    "flags" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Summery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagRelatorSummery" (
    "id" TEXT NOT NULL,
    "TagId" TEXT NOT NULL,
    "SummeryId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TagRelatorSummery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultSummery" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "SummeryId" TEXT NOT NULL,
    "LessonId" TEXT,
    "UnitId" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "DefaultSummery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSummery" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "SummeryId" TEXT NOT NULL,
    "skiped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSummery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_LessonId_fkey" FOREIGN KEY ("LessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summery" ADD CONSTRAINT "Summery_LessonId_fkey" FOREIGN KEY ("LessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summery" ADD CONSTRAINT "Summery_UnitId_fkey" FOREIGN KEY ("UnitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_LessonId_fkey" FOREIGN KEY ("LessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorAnalogy" ADD CONSTRAINT "TagRelatorAnalogy_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorAnalogy" ADD CONSTRAINT "TagRelatorAnalogy_AnalogyId_fkey" FOREIGN KEY ("AnalogyId") REFERENCES "Analogy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorParagraph" ADD CONSTRAINT "TagRelatorParagraph_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorParagraph" ADD CONSTRAINT "TagRelatorParagraph_ParagraphId_fkey" FOREIGN KEY ("ParagraphId") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorSummery" ADD CONSTRAINT "TagRelatorSummery_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorSummery" ADD CONSTRAINT "TagRelatorSummery_SummeryId_fkey" FOREIGN KEY ("SummeryId") REFERENCES "Summery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorKeyWords" ADD CONSTRAINT "TagRelatorKeyWords_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorKeyWords" ADD CONSTRAINT "TagRelatorKeyWords_KeyWordsId_fkey" FOREIGN KEY ("KeyWordsId") REFERENCES "KeyWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorNote" ADD CONSTRAINT "TagRelatorNote_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRelatorNote" ADD CONSTRAINT "TagRelatorNote_NoteId_fkey" FOREIGN KEY ("NoteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultAnalogy" ADD CONSTRAINT "DefaultAnalogy_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultAnalogy" ADD CONSTRAINT "DefaultAnalogy_AnalogyId_fkey" FOREIGN KEY ("AnalogyId") REFERENCES "Analogy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultParagraph" ADD CONSTRAINT "DefaultParagraph_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultParagraph" ADD CONSTRAINT "DefaultParagraph_ParagraphId_fkey" FOREIGN KEY ("ParagraphId") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultSummery" ADD CONSTRAINT "DefaultSummery_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultSummery" ADD CONSTRAINT "DefaultSummery_SummeryId_fkey" FOREIGN KEY ("SummeryId") REFERENCES "Summery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyWordDefault" ADD CONSTRAINT "KeyWordDefault_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyWordDefault" ADD CONSTRAINT "KeyWordDefault_KeyWordsId_fkey" FOREIGN KEY ("KeyWordsId") REFERENCES "KeyWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDefault" ADD CONSTRAINT "NoteDefault_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDefault" ADD CONSTRAINT "NoteDefault_NoteId_fkey" FOREIGN KEY ("NoteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnalogy" ADD CONSTRAINT "UserAnalogy_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnalogy" ADD CONSTRAINT "UserAnalogy_AnalogyId_fkey" FOREIGN KEY ("AnalogyId") REFERENCES "Analogy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParagraph" ADD CONSTRAINT "UserParagraph_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParagraph" ADD CONSTRAINT "UserParagraph_ParagraphId_fkey" FOREIGN KEY ("ParagraphId") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSummery" ADD CONSTRAINT "UserSummery_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSummery" ADD CONSTRAINT "UserSummery_SummeryId_fkey" FOREIGN KEY ("SummeryId") REFERENCES "Summery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKeyWords" ADD CONSTRAINT "UserKeyWords_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKeyWords" ADD CONSTRAINT "UserKeyWords_KeyWordsId_fkey" FOREIGN KEY ("KeyWordsId") REFERENCES "KeyWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_NoteId_fkey" FOREIGN KEY ("NoteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
