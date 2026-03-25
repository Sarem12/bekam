-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_defaultParagraphId_fkey";

-- AlterTable
ALTER TABLE "Paragraph" ALTER COLUMN "defaultParagraphId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_defaultParagraphId_fkey" FOREIGN KEY ("defaultParagraphId") REFERENCES "DefaultParagraph"("id") ON DELETE SET NULL ON UPDATE CASCADE;
