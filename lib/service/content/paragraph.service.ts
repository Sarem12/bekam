import { ChangeToBestParagraph, GetBestParagraph } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { 
    Lesson, RealParagraph, stringifiedContent, User,
    Paragraph, DefaultParagraph, Tag, TagRelatorParagraph, UserParagraph
} from "@/lib/types";

import { 
    user, lesson, realParagraph,
    paragraph as paragraphd, paragraphOut,
    masterParagraph, masterParagraphOut,
    userParagraph, userParagraphOut,
    tag, tagRelatorParagraph, tagRelatorParagraphOut
} from "@/datarelated/data";

import { stringifyLesson, stringifyDefaultParagraph } from "@/lib/stringifiers";

export async function GetParagraph(UserId: string, ParagraphId: string) {
    const paragraphRecord = await GetBestParagraph(UserId, ParagraphId);

    if (paragraphRecord !== null) {
        const p = (paragraphd as Paragraph[]).find(x => x.id === paragraphRecord.id);
        if (p) {
            p.views += 1;

            const da = (masterParagraph as DefaultParagraph[]).find(d => d.ParagraphId === p.id);
            if (da) da.views += 1;

            paragraphOut(paragraphd);
            masterParagraphOut(masterParagraph);
        }
        return { content: paragraphRecord.content, id: paragraphRecord.id };
    }

    const CurrentUser = user.find(u => u.id === UserId) as User;
    if (!CurrentUser) return { error: "User not found" };
     const CurrentParagraph = (realParagraph as RealParagraph[]).find(p => p.id === ParagraphId);
     if (!CurrentParagraph) return { error: "Paragraph not found" };
     const stringified = stringifyDefaultParagraph(CurrentParagraph);

    

    const response = await generateContent({
        requestType: 'paragraph',
        user: CurrentUser,
        target: stringified
    });

    if (response.error) throw new Error(response.error);

    const timestamp = Date.now();
    const paragrpahId = `par-${timestamp}`;
    const defaultParagrpahId = `defpar-${timestamp}`;

    // TAGS
    const paragraphTags: TagRelatorParagraph[] = (response.tagsUsed || [])
        .map((ta: string) => {
            const specificTag = (tag as Tag[]).find(t => t.name.toLowerCase() === ta.toLowerCase());
            if (!specificTag) return null;
            return {
                id: `tagrel-p-${timestamp}-${Math.random()}`,
                TagId: specificTag.id,
                ParagraphId: paragrpahId,
                likes: 0, dislikes: 0, views: 0, usage: 0, flags: 0,
            };
        })
        .filter(Boolean) as TagRelatorParagraph[];

    const newParagraph: Paragraph = {
        id: paragrpahId,
        content: response.content,
        LessonId: CurrentParagraph.LessonId,
        
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        MasterParagraphId: defaultParagrpahId,
        createdAt: new Date().toISOString(),
        
    };

    const defaultParagraph: DefaultParagraph = {
        id: defaultParagrpahId,
        content: response.content,
        LessonId: CurrentParagraph.LessonId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
       ParagraphId: paragrpahId,
        UserId: UserId,
        createdAt: new Date().toISOString(),
        order: 0,
        RealParagraphId: CurrentParagraph.id
    };


    const userparagraph: UserParagraph = {
        id: `userpar-${timestamp}`,
        UserId,
        ParagraphId: paragrpahId,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString(),
        skiped: false
    };

    paragraphd.push(newParagraph);
    masterParagraph.push(defaultParagraph);
    userParagraph.push(userparagraph);
    tagRelatorParagraph.push(...paragraphTags);

    paragraphOut(paragraphd);
    masterParagraphOut(masterParagraph);
    userParagraphOut(userParagraph);
    tagRelatorParagraphOut(tagRelatorParagraph);

    return { ...response, id: paragrpahId };
}

/**
 * CHANGE PARAGRAPH
 */
export async function ChangeParagraph(DefaultParagraphId: string, userId: string) {
    const def = (masterParagraph as DefaultParagraph[]).find(d => d.id === DefaultParagraphId);
    if (!def) return { error: "Default Paragraph not found" };

    // 1. mark current as skipped
    const current = (userParagraph as UserParagraph[]).find(u => 
        u.UserId === userId && u.ParagraphId === def.ParagraphId
    );

    if (current) {
        current.skiped = true;
        current.onuse = false;
        userParagraphOut(userParagraph);
    }

    // 2. try DB alternative
    const best = await ChangeToBestParagraph(DefaultParagraphId, userId);

    if (best !== null && best.id !== def.ParagraphId) {
        def.ParagraphId = best.id;
        def.content = best.content;
        def.likes = best.likes;
        def.dislikes = best.dislikes;
        def.views = best.views + 1;
        def.usage = best.usage;
        def.flags = best.flags;

        masterParagraphOut(masterParagraph);
        return best;
    }

    // 3. 🔥 NO reuse → generate directly
    const CurrentUser = user.find(u => u.id === userId) as User;
    if (!CurrentUser) return { error: "User not found" };

    const contentId = (def.ParagraphId) as string;

    let stringified: stringifiedContent;



        const CurrentParagraph = (realParagraph as RealParagraph[]).find(p => p.id === contentId);
        if (!CurrentParagraph) return { error: "Paragraph not found" };
        stringified = stringifyDefaultParagraph(CurrentParagraph);
    

    const response = await generateContent({
        requestType: 'paragraph',
        user: CurrentUser,
        target: stringified
    });

    if (response.error) return response;

    const timestamp = Date.now();
    const id= `par-${timestamp}`;

    const newParagraph: Paragraph = {
        id,
        content: response.content,
        logic: response.logic,
        LessonId: def.LessonId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        defaultParagraphId: DefaultParagraphId,
        createdAt: new Date().toISOString(),
    } as Paragraph;

    const userparagraph: UserParagraph = {
        id: `userpar-${timestamp}`,
        UserId: userId,
        ParagraphId: id,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString(),
        skiped: false
    };

    def.ParagraphId = id;
    def.content = response.content;
    def.likes = 0;
    def.dislikes = 0;
    def.views = 1;
    def.usage = 1;
    def.flags = 0;

    paragraphd.push(newParagraph);
    userParagraph.push(userparagraph);

    paragraphOut(paragraphd);
    masterParagraphOut(masterParagraph);
    userParagraphOut(userParagraph);

    return response;
}

/**
 * LIKE EVENT
 */
export async function LikeEventParagraph(UserId: string, ParagraphId: string) {
    const target = (userParagraph as UserParagraph[]).find(u => u.UserId === UserId && u.ParagraphId === ParagraphId);
    if (!target) return { error: "UserParagraph not found" };

    const wasdisliked = target.status === 'disliked';
    const isLiked = target.status === 'liked';

    target.status = isLiked ? 'neutral' : 'liked';
    const change = isLiked ? -1 : 1;

    const a = (paragraphd as Paragraph[]).find(x => x.id === ParagraphId);
    if (a) {
        a.likes += change;
        if (!isLiked && wasdisliked) a.dislikes = Math.max(0, a.dislikes - 1);
    }

    const da = (masterParagraph as DefaultParagraph[]).find(d => d.ParagraphId === ParagraphId);
    if (da) {
        da.likes += change;
        if (!isLiked && wasdisliked) da.dislikes = Math.max(0, da.dislikes - 1);
    }

    const tags = (tagRelatorParagraph as TagRelatorParagraph[]).filter(t => t.ParagraphId === ParagraphId);
    tags.forEach(t => {
        t.likes += change;
        if (!isLiked && wasdisliked) t.dislikes = Math.max(0, t.dislikes - 1);
    });

    paragraphOut(paragraphd);
    masterParagraphOut(masterParagraph);
    userParagraphOut(userParagraph);
    tagRelatorParagraphOut(tagRelatorParagraph);

    return { success: true, newStatus: target.status };
}

/**
 * DISLIKE EVENT
 */
export async function DislikeEventParagraph(UserId: string, ParagraphId: string) {
    const target = (userParagraph as UserParagraph[]).find(u => u.UserId === UserId && u.ParagraphId === ParagraphId);
    if (!target) return { error: "UserParagraph not found" };

    const wasliked = target.status === 'liked';
    const isDisliked = target.status === 'disliked';

    target.status = isDisliked ? 'neutral' : 'disliked';
    const change = isDisliked ? -1 : 1;

    const a = (paragraphd as Paragraph[]).find(x => x.id === ParagraphId);
    if (a) {
        a.dislikes += change;
        if (!isDisliked && wasliked) a.likes = Math.max(0, a.likes - 1);
    }

    const da = (masterParagraph as DefaultParagraph[]).find(d => d.ParagraphId === ParagraphId);
    if (da) {
        da.dislikes += change;
        if (!isDisliked && wasliked) da.likes = Math.max(0, da.likes - 1);
    }

    const tags = (tagRelatorParagraph as TagRelatorParagraph[]).filter(t => t.ParagraphId === ParagraphId);
    tags.forEach(t => {
        t.dislikes += change;
        if (!isDisliked && wasliked) t.likes = Math.max(0, t.likes - 1);
    });

    userParagraphOut(userParagraph);
    paragraphOut(paragraphd);
    masterParagraphOut(masterParagraph);
    tagRelatorParagraphOut(tagRelatorParagraph);

    return { success: true, newStatus: target.status };
}

/**
 * FLAG EVENT
 */
export async function FlagEventParagraph(UserId: string, ParagraphId: string) {
    const target = (userParagraph as UserParagraph[]).find(u => u.UserId === UserId && u.ParagraphId === ParagraphId);
    if (!target) return { error: "UserParagraph not found" };

    target.flaged = !target.flaged;
    const change = target.flaged ? 1 : -1;

    const a = (paragraphd as Paragraph[]).find(x => x.id === ParagraphId);
    if (a) a.flags = Math.max(0, a.flags + change);

    const da = (masterParagraph as DefaultParagraph[]).find(d => d.ParagraphId === ParagraphId);
    if (da) da.flags = Math.max(0, da.flags + change);

    const tags = (tagRelatorParagraph as TagRelatorParagraph[]).filter(t => t.ParagraphId === ParagraphId);
    tags.forEach(t => t.flags = Math.max(0, t.flags + change));

    userParagraphOut(userParagraph);
    paragraphOut(paragraphd);
    masterParagraphOut(masterParagraph);
    tagRelatorParagraphOut(tagRelatorParagraph);

    return { success: true, flagged: target.flaged };
}