import { getAllBooks, getUserById } from "@/lib/service";
import { BookCard } from "@/components/BookCard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  try {

   
    

    const [books] = await Promise.all([
      getAllBooks(),
     
    ]);

    // TYPE FIX: Guard clause ensures user is not null
   

    return (
      <div className=" min-h-screen">
        <main className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Textbooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                subject={book.subject}
                grade={book.grade}
                imageUrl={book.imgUrl || "/placeholder-book.jpg"}
                title={`${book.subject} - Grade ${book.grade}`}
                id={book.id}
              />
            ))}
          </div>
        </main>
      </div>
    );
  } catch (e: any) {

  }
}