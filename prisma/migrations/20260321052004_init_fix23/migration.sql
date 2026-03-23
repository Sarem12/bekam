-- CreateTable
CREATE TABLE "RealParagraph" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "LessonId" TEXT NOT NULL,

    CONSTRAINT "RealParagraph_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RealParagraph" ADD CONSTRAINT "RealParagraph_LessonId_fkey" FOREIGN KEY ("LessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analogy" ADD CONSTRAINT "Analogy_RealParagraphId_fkey" FOREIGN KEY ("RealParagraphId") REFERENCES "RealParagraph"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyWords" ADD CONSTRAINT "KeyWords_RealParagraphId_fkey" FOREIGN KEY ("RealParagraphId") REFERENCES "RealParagraph"("id") ON DELETE SET NULL ON UPDATE CASCADE;
