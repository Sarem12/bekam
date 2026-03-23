// lib/services/book.service.ts
import { prisma } from "@/lib/prisma";

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