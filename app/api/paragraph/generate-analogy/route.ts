import { NextResponse } from "next/server";
import { GetAnalogy } from "@/lib/service/content/analogy.service";

export async function POST(request: Request) {
  const { userId, paragraphId } = await request.json();
  if (!userId || !paragraphId) {
    return NextResponse.json({ error: "Missing userId or paragraphId" }, { status: 400 });
  }

  const result = await GetAnalogy(userId, paragraphId, 'paragraph');
  if ((result as any).error) {
    return NextResponse.json({ error: (result as any).error }, { status: 400 });
  }

  return NextResponse.json(result);
}
