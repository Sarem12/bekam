"use server";
// lib/services/book.service.ts
import { prisma } from "@/lib/prisma";
import { GetParagraph } from "@/lib/service/content/paragraph.service";
import { GetAnalogy } from "@/lib/service/content/analogy.service";
import { Book } from "@prisma/client";
import { FullBookContent } from "../types";
/**
 * GET ALL BOOKS
 * Fetches all books with a count of their units for the Home Page
 */
export async function getAllBooks() {
  try {
    return await prisma.book.findMany({
      select: {
        id: true,
        subject: true,
        grade: true,
        imgUrl: true,
        units: {
          select: { id: true } // We just need the count
        }
      },
      orderBy: { subject: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

/**
 * GET BOOK DETAILS
 * Fetches a single book and all its units/lessons when a user clicks it
 */
export async function getBookById(bookId: string) {
  return await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      units: {
        include: {
          lessons: {
            orderBy: { index: 'asc' }
          }
        }
      }
    }
  });
}
export async function getFullBookContent(bookId: string, userId: string):Promise<FullBookContent | null> {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      units: {
        include: {
          lessons: {
            orderBy: { index: 'asc' },
            include: {
              realParagraphs: {
                orderBy: { order: 'asc' },
                include: {
                  paragraphs: {
                    where: { UserId: userId },
                    include: {
                      activeInDefault: true
                    }
                  },
                  analogies: {
                    where: {
                      activeInSlots: {
                        is: { UserId: userId }
                      }
                    },
                    include: {
                      activeInSlots: true
                    }
                  },
                  keywords: {
                    where: {
                      activeInSlots: {
                        is: { UserId: userId }
                      }
                    },
                    include: {
                      activeInSlots: true
                    }
                  }
                }
              },
              summeries: {
                where: {
                  activeInSlots: {
                    is: { UserId: userId }
                  }
                }
              },
              notes: {
                where: {
                  activeInSlots: {
                    is: { UserId: userId }
                  }
                }
              },
              analogies: {
                where: {
                  activeInSlots: {
                    is: { UserId: userId }
                  }
                },
                include: { activeInSlots: true }
              },
              keywords: {
                where: {
                  activeInSlots: {
                    is: { UserId: userId,  }
                  }
                },
                include: { activeInSlots: true }
              },
              SubLessons: true
            }
          },
          summeries: {
            
            where: {
              
              activeInSlots: {
                is: { UserId: userId, onuse: true }
              }
            }
          }
        }
      }
    }
  });

  if (!book) return null;

  // Fallback generation behavior with content services
  for (const unit of book.units ?? []) {
    for (const lesson of unit.lessons ?? []) {
      if (!lesson.analogies?.length) {
        const gen = await GetAnalogy(userId, lesson.id, 'lesson');
        if (gen && !gen.error) {
          lesson.analogies = lesson.analogies ?? [];
          lesson.analogies.push({
            id: gen.id,
            content: gen.content,
            logic: gen.logic || "",
            lessonId: lesson.id,
            RealParagraphId: null,
            views: 0,
            usage: 0,
            createdAt: new Date(),
            activeInSlots: null,
            defaultAnalogyId: null,
          } as any);
        }
      } else {
        // Increment views for existing lesson analogies
        for (const analogy of lesson.analogies) {
          await prisma.analogy.update({
            where: { id: analogy.id },
            data: { views: { increment: 1 } }
          });
        }
      }

      for (const rp of lesson.realParagraphs ?? []) {
        const hasActiveParagraph = rp.paragraphs?.some((p: any) => p.activeInDefault);
        if (!hasActiveParagraph) {
          const fallbackParagraph = await GetParagraph(userId, rp.id);
          if (fallbackParagraph && !('error' in fallbackParagraph)) {
            rp.paragraphs = rp.paragraphs ?? [];
            rp.paragraphs.push({
              id: fallbackParagraph.id,
              content: fallbackParagraph.content,
              activeInDefault: { content: fallbackParagraph.content },
            } as any);
          }
        } else {
          // Increment views for existing default paragraph
          const existingParagraph = rp.paragraphs.find((p: any) => p.activeInDefault)?.activeInDefault;
          if (existingParagraph) {
            await prisma.paragraph.update({
              where: { id: existingParagraph.id },
              data: { views: { increment: 1 } }
            });
          }
        }

        if (!rp.analogies?.length) {
          const genAnalogy = await GetAnalogy(userId, rp.id, 'paragraph');
          if (genAnalogy && !genAnalogy.error) {
            rp.analogies = rp.analogies ?? [];
            rp.analogies.push({
              id: genAnalogy.id,
              content: genAnalogy.content,
              logic: genAnalogy.logic || "",
              lessonId: null,
              RealParagraphId: rp.id,
              views: 0,
              usage: 0,
              createdAt: new Date(),
              activeInSlots: null,
              defaultAnalogyId: null,
            } as any);
          }
        } else {
          // Increment views for existing paragraph analogies
          for (const analogy of rp.analogies) {
            await prisma.analogy.update({
              where: { id: analogy.id },
              data: { views: { increment: 1 } }
            });
          }
        }
      }
    }
  }

  return book;

}