import { NextResponse } from "next/server";
import { ChangeParagraph } from "@/lib/service/content/paragraph.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, realParagraphId } = await request.json();
  if (!userId || !realParagraphId) {
    return NextResponse.json({ error: "Missing userId or realParagraphId" }, { status: 400 });
  }

  const slot = await prisma.defaultParagraph.findFirst({
    where: { UserId: userId, RealParagraphId: realParagraphId }
  });

  if (!slot) {
    return NextResponse.json({ error: "No paragraph slot found for this user" }, { status: 404 });
  }

  const result = await ChangeParagraph(slot.id, userId);
  if ((result as any)?.error) {
    return NextResponse.json({ error: (result as any).error }, { status: 400 });
  }

  return NextResponse.json(result);
}
