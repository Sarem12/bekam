import { ChangeToBestAnalogy, GetBestAnalogy } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { 
    Lesson, RealParagraph, stringifiedContent, User,
    Analogy, DefaultAnalogy, Tag, TagRelatorAnalogy, UserAnalogy
} from "@/lib/types";

import { 
    user, lesson, realParagraph,
    analogy as analogyd, analogyOut,
    analogyDefault, analogyDefaultOut,
    userAnalogy, userAnalogyOut,
    tag, tagRelatorAnalogy, tagRelatorAnalogyOut
} from "@/datarelated/data";

import { stringifyLesson, stringifyDefaultParagraph } from "@/lib/stringifiers";

/**
 * GET ANALOGY
 */
export async function GetAnalogy(UserId: string, contentId: string, type: 'lesson' | 'paragraph') {
    const analogyRecord = await GetBestAnalogy(UserId, type, contentId);

    if (analogyRecord !== null) {
        const a = (analogyd as Analogy[]).find(x => x.id === analogyRecord.id);
        if (a) {
            a.views += 1;

            const da = (analogyDefault as DefaultAnalogy[]).find(d => d.AnalogyId === a.id);
            if (da) da.views += 1;

            analogyOut(analogyd);
            analogyDefaultOut(analogyDefault);
        }
        return { content: analogyRecord.content, id: analogyRecord.id };
    }

    const CurrentUser = user.find(u => u.id === UserId) as User;
    if (!CurrentUser) return { error: "User not found" };

    let stringified: stringifiedContent;
    let contentIdKey: "LessonId" | "ParagraphId";

    if (type === 'lesson') {
        const CurrentLesson = (lesson as Lesson[]).find(l => l.id === contentId);
        if (!CurrentLesson) return { error: "Lesson not found" };
        stringified = stringifyLesson(CurrentLesson);
        contentIdKey = "LessonId";
    } else {
        const CurrentParagraph = (realParagraph as RealParagraph[]).find(p => p.id === contentId);
        if (!CurrentParagraph) return { error: "Paragraph not found" };
        stringified = stringifyDefaultParagraph(CurrentParagraph);
        contentIdKey = "ParagraphId";
    }

    const response = await generateContent({
        requestType: 'analogy',
        user: CurrentUser,
        target: stringified
    });

    if (response.error) throw new Error(response.error);

    const timestamp = Date.now();
    const analogyId = `ana-${timestamp}`;
    const defaultAnalogyId = `defana-${timestamp}`;

    // TAGS
    const analogyTags: TagRelatorAnalogy[] = (response.tagsUsed || [])
        .map((ta: string) => {
            const specificTag = (tag as Tag[]).find(t => t.name.toLowerCase() === ta.toLowerCase());
            if (!specificTag) return null;
            return {
                id: `tagrel-a-${timestamp}-${Math.random()}`,
                TagId: specificTag.id,
                AnalogyId: analogyId,
                likes: 0, dislikes: 0, views: 0, usage: 0, flags: 0,
            };
        })
        .filter(Boolean) as TagRelatorAnalogy[];

    const newAnalogy: Analogy = {
        id: analogyId,
        content: response.content,
        logic: response.logic,
        [contentIdKey]: contentId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        defaultAnalogyId: defaultAnalogyId,
        createdAt: new Date().toISOString(),
    };

    const defaultAnalogy: DefaultAnalogy = {
        id: defaultAnalogyId,
        content: response.content,
        logic: response.logic,
        [contentIdKey]: contentId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        AnalogyId: analogyId,
        UserId: UserId,
        createdAt: new Date().toISOString(),
        order: 0
    };

    const useranalogy: UserAnalogy = {
        id: `userana-${timestamp}`,
        UserId,
        AnalogyId: analogyId,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString(),
        skiped: false
    };

    analogyd.push(newAnalogy);
    analogyDefault.push(defaultAnalogy);
    userAnalogy.push(useranalogy);
    tagRelatorAnalogy.push(...analogyTags);

    analogyOut(analogyd);
    analogyDefaultOut(analogyDefault);
    userAnalogyOut(userAnalogy);
    tagRelatorAnalogyOut(tagRelatorAnalogy);

    return { ...response, id: analogyId };
}

/**
 * CHANGE ANALOGY
 */
export async function ChangeAnalogy(DefaultAnalogyId: string, userId: string) {
    const def = (analogyDefault as DefaultAnalogy[]).find(d => d.id === DefaultAnalogyId);
    if (!def) return { error: "Default Analogy not found" };

    // 1. mark current as skipped
    const current = (userAnalogy as UserAnalogy[]).find(u => 
        u.UserId === userId && u.AnalogyId === def.AnalogyId
    );

    if (current) {
        current.skiped = true;
        current.onuse = false;
        userAnalogyOut(userAnalogy);
    }

    // 2. try DB alternative
    const best = await ChangeToBestAnalogy(DefaultAnalogyId, userId);

    if (best !== null && best.id !== def.AnalogyId) {
        def.AnalogyId = best.id;
        def.content = best.content;
        def.likes = best.likes;
        def.dislikes = best.dislikes;
        def.views = best.views + 1;
        def.usage = best.usage;
        def.flags = best.flags;

        analogyDefaultOut(analogyDefault);
        return best;
    }

    // 3. 🔥 NO reuse → generate directly
    const CurrentUser = user.find(u => u.id === userId) as User;
    if (!CurrentUser) return { error: "User not found" };

    const type = def.lessonId ? 'lesson' : 'paragraph';
    const contentId = (def.lessonId || def.ParagraphId) as string;

    let stringified: stringifiedContent;
    let contentIdKey: "lessonId" | "ParagraphId";

    if (type === 'lesson') {
        const CurrentLesson = (lesson as Lesson[]).find(l => l.id === contentId);
        if (!CurrentLesson) return { error: "Lesson not found" };
        stringified = stringifyLesson(CurrentLesson);
        contentIdKey = "lessonId";
    } else {
        const CurrentParagraph = (realParagraph as RealParagraph[]).find(p => p.id === contentId);
        if (!CurrentParagraph) return { error: "Paragraph not found" };
        stringified = stringifyDefaultParagraph(CurrentParagraph);
        contentIdKey = "ParagraphId";
    }

    const response = await generateContent({
        requestType: 'analogy',
        user: CurrentUser,
        target: stringified
    });

    if (response.error) return response;

    const timestamp = Date.now();
    const analogyId = `ana-${timestamp}`;

    const newAnalogy: Analogy = {
        id: analogyId,
        content: response.content,
        logic: response.logic,
        [contentIdKey]: contentId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        defaultAnalogyId: DefaultAnalogyId,
        createdAt: new Date().toISOString(),
    } as Analogy;

    const useranalogy: UserAnalogy = {
        id: `userana-${timestamp}`,
        UserId: userId,
        AnalogyId: analogyId,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString(),
        skiped: false
    };

    def.AnalogyId = analogyId;
    def.content = response.content;
    def.likes = 0;
    def.dislikes = 0;
    def.views = 1;
    def.usage = 1;
    def.flags = 0;

    analogyd.push(newAnalogy);
    userAnalogy.push(useranalogy);

    analogyOut(analogyd);
    analogyDefaultOut(analogyDefault);
    userAnalogyOut(userAnalogy);

    return response;
}

/**
 * LIKE EVENT
 */
export async function LikeEventAnalogy(UserId: string, AnalogyId: string) {
    const target = (userAnalogy as UserAnalogy[]).find(u => u.UserId === UserId && u.AnalogyId === AnalogyId);
    if (!target) return { error: "UserAnalogy not found" };

    const wasdisliked = target.status === 'disliked';
    const isLiked = target.status === 'liked';

    target.status = isLiked ? 'neutral' : 'liked';
    const change = isLiked ? -1 : 1;

    const a = (analogyd as Analogy[]).find(x => x.id === AnalogyId);
    if (a) {
        a.likes += change;
        if (!isLiked && wasdisliked) a.dislikes = Math.max(0, a.dislikes - 1);
    }

    const da = (analogyDefault as DefaultAnalogy[]).find(d => d.AnalogyId === AnalogyId);
    if (da) {
        da.likes += change;
        if (!isLiked && wasdisliked) da.dislikes = Math.max(0, da.dislikes - 1);
    }

    const tags = (tagRelatorAnalogy as TagRelatorAnalogy[]).filter(t => t.AnalogyId === AnalogyId);
    tags.forEach(t => {
        t.likes += change;
        if (!isLiked && wasdisliked) t.dislikes = Math.max(0, t.dislikes - 1);
    });

    analogyOut(analogyd);
    analogyDefaultOut(analogyDefault);
    userAnalogyOut(userAnalogy);
    tagRelatorAnalogyOut(tagRelatorAnalogy);

    return { success: true, newStatus: target.status };
}

/**
 * DISLIKE EVENT
 */
export async function DislikeEventAnalogy(UserId: string, AnalogyId: string) {
    const target = (userAnalogy as UserAnalogy[]).find(u => u.UserId === UserId && u.AnalogyId === AnalogyId);
    if (!target) return { error: "UserAnalogy not found" };

    const wasliked = target.status === 'liked';
    const isDisliked = target.status === 'disliked';

    target.status = isDisliked ? 'neutral' : 'disliked';
    const change = isDisliked ? -1 : 1;

    const a = (analogyd as Analogy[]).find(x => x.id === AnalogyId);
    if (a) {
        a.dislikes += change;
        if (!isDisliked && wasliked) a.likes = Math.max(0, a.likes - 1);
    }

    const da = (analogyDefault as DefaultAnalogy[]).find(d => d.AnalogyId === AnalogyId);
    if (da) {
        da.dislikes += change;
        if (!isDisliked && wasliked) da.likes = Math.max(0, da.likes - 1);
    }

    const tags = (tagRelatorAnalogy as TagRelatorAnalogy[]).filter(t => t.AnalogyId === AnalogyId);
    tags.forEach(t => {
        t.dislikes += change;
        if (!isDisliked && wasliked) t.likes = Math.max(0, t.likes - 1);
    });

    userAnalogyOut(userAnalogy);
    analogyOut(analogyd);
    analogyDefaultOut(analogyDefault);
    tagRelatorAnalogyOut(tagRelatorAnalogy);

    return { success: true, newStatus: target.status };
}

/**
 * FLAG EVENT
 */
export async function FlagEventAnalogy(UserId: string, AnalogyId: string) {
    const target = (userAnalogy as UserAnalogy[]).find(u => u.UserId === UserId && u.AnalogyId === AnalogyId);
    if (!target) return { error: "UserAnalogy not found" };

    target.flaged = !target.flaged;
    const change = target.flaged ? 1 : -1;

    const a = (analogyd as Analogy[]).find(x => x.id === AnalogyId);
    if (a) a.flags = Math.max(0, a.flags + change);

    const da = (analogyDefault as DefaultAnalogy[]).find(d => d.AnalogyId === AnalogyId);
    if (da) da.flags = Math.max(0, da.flags + change);

    const tags = (tagRelatorAnalogy as TagRelatorAnalogy[]).filter(t => t.AnalogyId === AnalogyId);
    tags.forEach(t => t.flags = Math.max(0, t.flags + change));

    userAnalogyOut(userAnalogy);
    analogyOut(analogyd);
    analogyDefaultOut(analogyDefault);
    tagRelatorAnalogyOut(tagRelatorAnalogy);

    return { success: true, flagged: target.flaged };
}