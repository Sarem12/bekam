import { NextResponse } from "next/server";
import { DislikeEventParagraph } from "@/lib/service/content/paragraph.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, realParagraphId } = await request.json();
  if (!userId || !realParagraphId) {
    return NextResponse.json({ error: "Missing userId or realParagraphId" }, { status: 400 });
  }

  const slot = await prisma.defaultParagraph.findFirst({
    where: { UserId: userId, RealParagraphId: realParagraphId },
    include: { activeInDefault: true }
  });

  if (!slot || !slot.activeInDefault) {
    return NextResponse.json({ error: "No active paragraph found for this user" }, { status: 404 });
  }

  const result = await DislikeEventParagraph(userId, slot.activeInDefault.id);
  if ((result as any)?.error) {
    return NextResponse.json({ error: (result as any).error }, { status: 400 });
  }

  return NextResponse.json(result);
}
