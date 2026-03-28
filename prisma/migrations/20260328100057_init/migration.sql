/*
  Warnings:

  - You are about to drop the column `oneuse` on the `DefaultParagraph` table. All the data in the column will be lost.
  - You are about to drop the column `oneuse` on the `DefaultSummery` table. All the data in the column will be lost.
  - You are about to drop the column `oneuse` on the `KeyWordDefault` table. All the data in the column will be lost.
  - You are about to drop the column `oneuse` on the `NoteDefault` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DefaultParagraph" DROP COLUMN "oneuse",
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "DefaultSummery" DROP COLUMN "oneuse",
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "KeyWordDefault" DROP COLUMN "oneuse",
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NoteDefault" DROP COLUMN "oneuse",
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false;
