import Image from "next/image";
import { getAllBooks, getUserById } from "@/lib/service";
import { BookCard } from "@/components/BookCard";
import { cookies } from "next/headers"; // Built-in Next.js helper

export default async function Home() {
  try {
    // 1. Get the ID from the Cookie (Server-side)
    const cookieStore = await cookies();
    const userid = cookieStore.get("bekam_user_id")?.value;

    if (!userid) {
       return <div className="p-10 text-white">Please log in to view your books.</div>;
    }

    // 2. Fetch data (This runs safely on the server)
    const [books, user] = await Promise.all([
      getAllBooks(),
      getUserById(userid)
    ]);

    return (
      <div >
        <header>
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user?.first} {user?.last}!
          </h1>
        </header>
        
        <div>
          {books.map((book) => (
            <BookCard
              key={book.id}
              subject={book.subject}
              grade={book.grade}
              imageUrl={book.imgUrl}
              title={`${book.subject} - Grade ${book.grade}`}
            />
          ))}
        </div>
      </div>
    );
  } catch (e: any) {
    return <div className="p-10 text-red-500 font-mono">BOOT_ERROR: {e.message}</div>;
  }
}