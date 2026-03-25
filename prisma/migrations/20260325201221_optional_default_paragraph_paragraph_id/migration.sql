-- DropForeignKey
ALTER TABLE "DefaultParagraph" DROP CONSTRAINT "DefaultParagraph_ParagraphId_fkey";

-- AlterTable
ALTER TABLE "DefaultParagraph" ALTER COLUMN "ParagraphId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DefaultParagraph" ADD CONSTRAINT "DefaultParagraph_ParagraphId_fkey" FOREIGN KEY ("ParagraphId") REFERENCES "Paragraph"("id") ON DELETE SET NULL ON UPDATE CASCADE;
