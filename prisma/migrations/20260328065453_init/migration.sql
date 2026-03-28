-- AlterTable
ALTER TABLE "DefaultAnalogy" ADD COLUMN     "oneuse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DefaultParagraph" ADD COLUMN     "oneuse" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "DefaultSummery" ADD COLUMN     "oneuse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "KeyWordDefault" ADD COLUMN     "oneuse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NoteDefault" ADD COLUMN     "oneuse" BOOLEAN NOT NULL DEFAULT false;
