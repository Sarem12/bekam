"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFullBookContent } from "@/lib/service/book.service";
import { authUtils } from "@/lib/localdata";
import ReactMarkdown from "react-markdown";
import { Book } from "@prisma/client";
import { FullBookContent } from "@/lib/types";



const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-slate-700 bg-slate-800/80 rounded-xl p-3 mb-3">
    <h4 className="text-sm font-semibold text-emerald-300 mb-1">{title}</h4>
    <div className="text-sm text-slate-100">{children}</div>
  </div>
);

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
          {unit.summeries.filter(s => s.activeInSlots?.onuse === true) .map((ds: any) => (
            <InfoCard key={ds.id} title="Unit Summary">
              <ReactMarkdown>{ds.content}</ReactMarkdown>
            </InfoCard>
          ))}
          {unit.lessons.map(lesson => (
            <div key={lesson.id} className="mb-6 ml-4">
              <h3 className="text-xl font-medium mb-2">{lesson.title}</h3>

              {lesson.summeries.filter(s => s.activeInSlots?.onuse === true).map((summary) => (
                <InfoCard key={summary.id} title="Lesson Summary">
                  <ReactMarkdown>{summary.content}</ReactMarkdown>
                </InfoCard>
              ))}

              {lesson.notes.filter(n => n.activeInSlots?.onuse === true).map((note) => (
                <InfoCard key={note.id} title="Lesson Note">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </InfoCard>
              ))}

              {lesson.analogies.filter(a => a.activeInSlots?.onuse === true).map((analogy) => (
                <InfoCard key={analogy.id} title="Lesson Analogy">
                  <ReactMarkdown>{analogy.content}</ReactMarkdown>
                </InfoCard>
              ))}

              {lesson.keywords.filter(k => k.activeInSlots?.onuse === true).map((keyword: any) => (
                <InfoCard key={keyword.id} title="Lesson Keywords">
                  <ReactMarkdown>{keyword.content || keyword.id}</ReactMarkdown>
                </InfoCard>
              ))}

              {lesson.realParagraphs.map((rp) => {
                const chosenParagraph = rp.paragraphs?.[0]?.activeInDefault;

                return (
                  <div key={rp.id} className="mb-4 ml-4">
                    
                    <div className="text-base text-slate-100 mb-2">
                      <ReactMarkdown>
                      {chosenParagraph?.content || rp.content || "No paragraph content available"}
                      </ReactMarkdown>
                    </div>
                    
                    {rp.analogies.filter(a => a.activeInSlots?.onuse === true).map((a: any) => (
                      <InfoCard key={a.id} title="Paragraph Analogy">
                        <ReactMarkdown>{a.content}</ReactMarkdown>
                      </InfoCard>
                    ))}

                    {lesson.notes?.filter(n => n.activeInSlots?.onuse === true).map((n: any) => (
                      <InfoCard key={`note-${n.id}`} title="Paragraph Note">
                        <ReactMarkdown>{n.content}</ReactMarkdown>
                      </InfoCard>
                    ))}

                    {rp.keywords?.filter(k => k.activeInSlots?.onuse === true).map((k: any) => (
                      <InfoCard key={k.id} title="Paragraph Keyword">
                        <ReactMarkdown>{k.content || "No keyword text"}</ReactMarkdown>
                      </InfoCard>
                    ))}

                    {lesson.summeries?.filter(s => s.activeInSlots?.onuse === true).map((s: any) => (
                      <InfoCard key={`summary-${s.id}`} title="Paragraph Summary">
                        <ReactMarkdown>{s.content}</ReactMarkdown>
                      </InfoCard>
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