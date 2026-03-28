/*
  Warnings:

  - You are about to drop the column `oneuse` on the `DefaultAnalogy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DefaultAnalogy" DROP COLUMN "oneuse",
ADD COLUMN     "onuse" BOOLEAN NOT NULL DEFAULT false;
