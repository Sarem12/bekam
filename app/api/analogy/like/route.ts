import { NextResponse } from "next/server";
import { LikeEventAnalogy } from "@/lib/service/content/analogy.service";

export async function POST(request: Request) {
  const { userId, analogyId } = await request.json();

  if (!userId || !analogyId) {
    return NextResponse.json({ error: "Missing userId or analogyId" }, { status: 400 });
  }

  const result = await LikeEventAnalogy(userId, analogyId);
  if ((result as any)?.error) {
    return NextResponse.json({ error: (result as any).error }, { status: 400 });
  }

  return NextResponse.json(result);
}
