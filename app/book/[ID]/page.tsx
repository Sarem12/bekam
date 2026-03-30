"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFullBookContent } from "@/lib/service/book.service";
import { authUtils } from "@/lib/localdata";
import ReactMarkdown from "react-markdown";
import { Book } from "@prisma/client";
import { FullBookContent } from "@/lib/types";
import { Analogy } from "@/components/InfoCards/Analogy";
import { Paragraph } from "@/components/InfoCards/Paragraph";

export default function BookPage() {
  const params = useParams();
  const bookId = params.ID as string;
  const [book, setBook] = useState<FullBookContent>({
    id: "",
    subject: "",
    grade: 0,
    imgUrl: "",
    units: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      const userId = authUtils.getId();
  if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
  }

      try {
        const data = await getFullBookContent(bookId, userId);
        if (!data) return setError("Book not found");
        setBook(data);
      } catch (err) {
        setError("Failed to load book content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{book.subject} - Grade {book.grade}</h1>
  
      {book.units?.map((unit) => (
        <div key={unit.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{unit.title}</h2>
          {/* Unit-level summaries (activeInSlots) */}
          {unit.summeries.filter(s => s.activeInSlots?.onuse === true).map((ds: any) => (
            <div key={ds.id} className="mb-4 text-slate-100">
              <ReactMarkdown>{ds.content}</ReactMarkdown>
            </div>
          ))}
          {unit.lessons.map(lesson => (
            <div key={lesson.id} className="mb-6 ml-4">
              <h3 className="text-xl font-medium mb-2">{lesson.title}</h3>

              {lesson.summeries.filter(s => s.activeInSlots?.onuse === true).map((summary) => (
                <div key={summary.id} className="mb-4 text-slate-100">
                  <ReactMarkdown>{summary.content}</ReactMarkdown>
                </div>
              ))}

              {lesson.notes.filter(n => n.activeInSlots?.onuse === true).map((note) => (
                <div key={note.id} className="mb-4 text-slate-100">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
              ))}

              {lesson.analogies.filter(a => a.activeInSlots?.onuse === true).map((analogy) => (
                <Analogy key={analogy.id} analogy={analogy as any} />
              ))}

              {lesson.keywords.filter(k => k.activeInSlots?.onuse === true).map((keyword: any) => (
                <div key={keyword.id} className="mb-4 text-slate-100">
                  <ReactMarkdown>{keyword.content || keyword.id}</ReactMarkdown>
                </div>
              ))}

              {lesson.realParagraphs.map((rp) => {
                const chosenParagraph = rp.paragraphs?.[0]?.activeInDefault;

                return (
                  <div key={rp.id} className="mb-4 ml-4">
                    <Paragraph
                      paragraph={{
                        id: rp.id,
                        content: chosenParagraph?.content || rp.content || "No paragraph content available"
                      }}
                    />

                    {rp.analogies.filter(a => a.activeInSlots?.onuse === true).map((a: any) => (
                      <Analogy key={a.id} analogy={a as any} />
                    ))}

                    {lesson.notes?.filter(n => n.activeInSlots?.onuse === true).map((n: any) => (
                      <div key={`note-${n.id}`} className="mb-4 text-slate-100">
                        <ReactMarkdown>{n.content}</ReactMarkdown>
                      </div>
                    ))}

                    {rp.keywords?.filter(k => k.activeInSlots?.onuse === true).map((k: any) => (
                      <div key={k.id} className="mb-4 text-slate-100">
                        <ReactMarkdown>{k.content || "No keyword text"}</ReactMarkdown>
                      </div>
                    ))}

                    {lesson.summeries?.filter(s => s.activeInSlots?.onuse === true).map((s: any) => (
                      <div key={`summary-${s.id}`} className="mb-4 text-slate-100">
                        <ReactMarkdown>{s.content}</ReactMarkdown>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}