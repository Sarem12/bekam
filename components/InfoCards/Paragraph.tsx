"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MoreVertical, Lightbulb, ThumbsUp, ThumbsDown, Flag, RefreshCw } from "lucide-react";
import { authUtils } from "@/lib/localdata";
import { Analogy } from "./Analogy";

type ParagraphProps = {
  paragraph: {
    id: string;
    content: string;
  };
};

export function Paragraph({ paragraph }: ParagraphProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<string | null>(null);
  const [generatedAnalogy, setGeneratedAnalogy] = useState<any | null>(null);
  const [analogyOnUse, setAnalogyOnUse] = useState(false);
  const [userStatus, setUserStatus] = useState<"liked" | "disliked" | "neutral">("neutral");
  const [isFlagged, setIsFlagged] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>(paragraph.content || "");

  useEffect(() => {
    setCurrentContent(paragraph.content || "");
  }, [paragraph.content]);

  const content = currentContent;

  const parseJsonResponse = async (response: Response) => {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Response JSON parse failed:", text, error);
      return { error: "Invalid JSON response" };
    }
  };

  const handleGenerateAnalogy = async () => {
    const userId = authUtils.getId();
    if (!userId) {
      setGenerateStatus("Sign in to generate an analogy");
      setShowMenu(false);
      return;
    }

    setShowMenu(false);
    setIsGenerating(true);
    setGeneratedAnalogy(null);
    setAnalogyOnUse(false);
    setGenerateStatus("Generating analogy...");

    try {
      const response = await fetch("/api/paragraph/generate-analogy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, paragraphId: paragraph.id })
      });
      const result = await parseJsonResponse(response);

      if (!response.ok || !result || result?.error) {
        console.error(result?.error || "Failed to generate analogy");
        setGenerateStatus("Failed to generate analogy");
        return;
      }

      setGeneratedAnalogy({ ...result, activeInSlots: { onuse: true } });
      setAnalogyOnUse(true);
      setGenerateStatus("Analogy active");
    } catch (error) {
      console.error("Generate Analogy error", error);
      setGenerateStatus("Error generating analogy");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendParagraphAction = async (action: "like" | "dislike" | "flag" | "change") => {
    const userId = authUtils.getId();
    if (!userId) {
      setGenerateStatus("Sign in to perform this action");
      setShowMenu(false);
      return;
    }

    if (action === "change") {
      setGenerateStatus("Regenerating paragraph...");
      setGeneratedAnalogy(null);
      setAnalogyOnUse(false);
    }

    setLoadingAction(true);
    try {
      const path = action === "change" ? "/api/paragraph/change" : `/api/paragraph/${action}`;
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, realParagraphId: paragraph.id })
      });
      const result = await parseJsonResponse(response);
      if (!response.ok || !result || result?.error) {
        const errorMessage = result?.error || "Paragraph action failed";
        console.error(errorMessage);
        setGenerateStatus("Action failed");
        return;
      }

      if (action === "change") {
        if (typeof result.content === "string") {
          setCurrentContent(result.content);
        }
      } else if (action === "flag") {
        setIsFlagged(Boolean(result.flagged));
      } else if (action === "like" || action === "dislike") {
        setUserStatus(result.newStatus ?? "neutral");
      }
      setGenerateStatus(action === "change" ? "Regenerated paragraph" : null);
    } catch (error) {
      console.error("Paragraph action error", error);
      setGenerateStatus("Error performing action");
    } finally {
      setLoadingAction(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative text-base leading-7 text-slate-100">
      <ReactMarkdown>{content}</ReactMarkdown>
      {generateStatus && (
        <div className="mt-2 text-xs text-slate-400">{generateStatus}</div>
      )}

      {generatedAnalogy && analogyOnUse && (
        <div className="mt-4">
          <Analogy analogy={generatedAnalogy} />
        </div>
      )}

      <div className="mt-2 flex justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu((open) => !open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-700/30"
            aria-label="Paragraph menu"
          >
            <MoreVertical className="h-4 w-4 text-slate-300" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-700/80 bg-slate-950/95 p-2 text-left text-sm text-slate-200 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => sendParagraphAction("like")}
                  disabled={loadingAction}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${userStatus === "liked" ? "text-emerald-300" : "hover:bg-white/10"} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Like
                </button>
                <button
                  type="button"
                  onClick={() => sendParagraphAction("dislike")}
                  disabled={loadingAction}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${userStatus === "disliked" ? "text-rose-300" : "hover:bg-white/10"} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Dislike
                </button>
                <button
                  type="button"
                  onClick={() => sendParagraphAction("flag")}
                  disabled={loadingAction}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${isFlagged ? "text-amber-300" : "hover:bg-white/10"} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <Flag className="h-4 w-4" />
                  Flag
                </button>
                <button
                  type="button"
                  onClick={() => sendParagraphAction("change")}
                  disabled={loadingAction}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </button>
                <div className="my-1 border-t border-slate-700/80" />
                <button
                  type="button"
                  onClick={handleGenerateAnalogy}
                  disabled={isGenerating}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Lightbulb className="h-4 w-4 text-amber-300" />
                  {isGenerating ? "Generating..." : "Generate Analogy"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
