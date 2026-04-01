import type { Metadata } from "next";
import { getBookById } from "@/lib/service";

type BookLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ ID: string }>;
};

export async function generateMetadata({ params }: BookLayoutProps): Promise<Metadata> {
  const { ID } = await params;
  const book = await getBookById(ID);

  if (!book) {
    return {
      title: "Book",
    };
  }

  return {
    title: `${book.subject} - Grade ${book.grade}`,
  };
}

export default async function BookLayout({ children }: BookLayoutProps) {
  return children;
}
