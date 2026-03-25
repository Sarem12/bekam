/*
  Warnings:

  - Made the column `defaultParagraphId` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_defaultParagraphId_fkey";

-- AlterTable
ALTER TABLE "Paragraph" ALTER COLUMN "defaultParagraphId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_defaultParagraphId_fkey" FOREIGN KEY ("defaultParagraphId") REFERENCES "DefaultParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultParagraph" ADD CONSTRAINT "DefaultParagraph_RealParagraphId_fkey" FOREIGN KEY ("RealParagraphId") REFERENCES "RealParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
