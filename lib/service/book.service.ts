"use server";
// lib/services/book.service.ts
import { prisma } from "@/lib/prisma";
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
                      activeInSlots: true,
                      userActions: {
                        where: { UserId: userId }
                      }
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
                include: {
                  activeInSlots: true,
                  userActions: {
                    where: { UserId: userId }
                  }
                }
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

  // Do not generate missing analogies automatically on page load.
  // The user should request generation explicitly through the UI.
  for (const unit of book.units ?? []) {
    for (const lesson of unit.lessons ?? []) {
      for (const analogy of lesson.analogies ?? []) {
        await prisma.analogy.update({
          where: { id: analogy.id },
          data: { views: { increment: 1 } }
        });
      }

      for (const rp of lesson.realParagraphs ?? []) {
        const existingParagraph = rp.paragraphs?.find((p: any) => p.activeInDefault)?.activeInDefault;
        if (existingParagraph) {
          await prisma.paragraph.update({
            where: { id: existingParagraph.id },
            data: { views: { increment: 1 } }
          });
        }

        for (const analogy of rp.analogies ?? []) {
          await prisma.analogy.update({
            where: { id: analogy.id },
            data: { views: { increment: 1 } }
          });
        }
      }
    }
  }

  return book;

}