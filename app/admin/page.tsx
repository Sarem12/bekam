
import { getAllBooks } from "@/lib/service";
import { deleteBook, createBook } from "@/lib/service/admin";
import AddBookModal from "@/components/admin/AddBookModal";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const books = await getAllBooks();

  // Named Server Action for better reliability
  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("bookId") as string;
    await deleteBook(id);
    revalidatePath("/admin"); // Refresh the list instantly
  }

  async function handleCreateBook(formData: FormData) {
    "use server";
    const subject = (formData.get("subject") as string)?.trim();
    const grade = Number(formData.get("grade"));
    const imgUrl = (formData.get("imgUrl") as string) || "/images/default.jpg";

    if (!subject || Number.isNaN(grade)) {
      throw new Error("Invalid book payload");
    }

    await createBook({
      subject,
      grade,
      imgUrl,
    });

    revalidatePath("/admin");
  }

  return (
    <div className="p-10 text-white bg-[#212121] min-h-screen">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Curriculum Manager</h1>
          <p className="text-slate-400 text-sm">Manage textbooks and AI content nodes.</p>
        </div>
        <AddBookModal onCreateBook={handleCreateBook} />
      </header>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className=" border-b border-slate-700">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Book Details</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Grade</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-slate-700/30 transition-all group">
                <td className="p-4">
                  <div className="font-bold text-slate-200 group-hover:text-slate-100 transition-colors text-lg">
                    {book.subject}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 opacity-50">
                    ID: {book.id}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="bg-slate-700/30 text-slate-100 px-3 py-1 rounded-full text-xs border border-slate-600/40 font-medium">
                    Grade {book.grade}
                  </span>
                </td>
                <td className="p-4 px-6">
                   <div className="flex justify-end gap-3">
                      <Link 
                        href={`/admin/book/${book.id}`}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center"
                      >
                        Edit Units
                      </Link>
                      
                      {/* Fixed Server Action Form */}
                      <form action={handleDelete}>
                        <input type="hidden" name="bookId" value={book.id} />
                        <button 
                          type="submit"
                          className="bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 px-4 py-2 rounded-lg text-sm transition-all border border-red-500/20"
                        >
                          Delete
                        </button>
                      </form>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}