import { GetBestParagraph, ChangeToBestParagraph } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { 
    Paragraph, RealParagraph, UserParagraph, 
    User, Tag, TagRelatorParagraph 
} from "@/lib/types";
import { 
    user, realParagraph, paragraph, paragraphOut, 
    userParagraph, userParagraphOut, tag, 
    tagRelatorParagraph, tagRelatorParagraphOut 
} from "@/datarelated/data";

export async function GetParagraph(UserId: string, realParagraphId: string) {
    const bestPara = await GetBestParagraph(realParagraphId, UserId);
    
    if (bestPara !== null) {
        const p = (paragraph as Paragraph[]).find(x => x.id === bestPara.id);
        if (p) {
            p.views += 1;
            paragraphOut(paragraph);
        }
        return { content: bestPara.content, id: bestPara.id };
    }

    const CurrentUser = user.find(u => u.id === UserId) as User;
    const base = (realParagraph as RealParagraph[]).find(rp => rp.id === realParagraphId);
    if (!base) return { error: "Source paragraph not found" };

    const response = await generateContent({
        requestType: 'paragraph',
        user: CurrentUser,
        target: { content: base.content, depth: 1 }
    });

    if (response.error) return response;

    const timestamp = Date.now();
    const paraId = `para-${timestamp}`;

    const newPara: Paragraph = {
        id: paraId,
        content: response.content,
        LessonId: base.LessonId,
        MasterParagraphId: base.MasterParagraphId,
        order: base.order,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        createdAt: new Date().toISOString(),
    };

    userParagraph.push({
        id: `up-${timestamp}`, UserId, ParagraphId: paraId,
        status: 'neutral', flaged: false, onuse: true, 
        lastSeenAt: new Date().toISOString(), skiped: false
    });

    paragraph.push(newPara);
    paragraphOut(paragraph);
    userParagraphOut(userParagraph);
    return { ...response, id: paraId };
}

export async function ChangeParagraph(currentParaId: string, userId: string) {
    const currentUP = (userParagraph as UserParagraph[]).find(up => 
        up.UserId === userId && up.ParagraphId === currentParaId
    );
    
    if (currentUP) {
        currentUP.skiped = true;
        currentUP.onuse = false;
        userParagraphOut(userParagraph);
    }

    const existingBest = await ChangeToBestParagraph(currentParaId, userId);
    if (existingBest !== null) {
        const p = (paragraph as Paragraph[]).find(x => x.id === existingBest.id);
        if (p) p.views += 1;
        paragraphOut(paragraph);
        return { content: existingBest.content, id: existingBest.id };
    }

    const ref = (paragraph as Paragraph[]).find(p => p.id === currentParaId);
    const real = (realParagraph as RealParagraph[]).find(rp => rp.MasterParagraphId === ref?.MasterParagraphId);
    return await GetParagraph(userId, real?.id || "");
}