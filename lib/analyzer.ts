import { 
    Analogy, Tag, TagRelatorAnalogy, UserTag, UserAnalogy, 
    RealParagraph, TagRelatorParagraph, 
    Summery, UserSummery, TagRelatorSummery,
    KeyWord, KeyWords, UserKeyWords, TagRelatorKeyWords, 
    UserNote,
    Note,
    TagRelatorNote
} from "./temporarytype";

import { 
    analogy, tagUser, tagRelatorAnalogy, tag, userAnalogy,
    realParagraph, tagRelatorParagraph, 
    summery, tagRelatorSummery, userSummery,
    keyword, keywords, tagRelatorKeyWords, userKeyWords,
    tagRelatorNote,
    userNote,
    note
} from "@/datarelated/data";
import { universalTag } from "@/datarelated/data"; 
import { UniversalTag } from "./temporarytype";

function calculateScore(
    contentId: string,
    contentKey: 'AnalogyId' | 'ParagraphId' | 'SummeryId' | 'KeyWordsId' | 'NoteId',
    relators: any[],
    userProfile: UserTag[],
    rejectedTagIds: string[] = [],
    isDisliked: boolean = false
): number {
    let score = 0;
    const universalTags = universalTag as UniversalTag[];

    // 1. Get all unique Tag IDs related to this content piece
    const contentRelators = relators.filter(r => r[contentKey] === contentId);
    const contentTagIds = contentRelators.map(r => r.TagId);

    // 2. Process Universal Tags (Baseline / Secondary Recommendation)
    for (const utag of universalTags) {
        if (contentTagIds.includes(utag.TagId)) {
            const relator = contentRelators.find(r => r.TagId === utag.TagId);
            if (relator) {
                const approval = (relator.likes + relator.dislikes) > 0 
                    ? relator.likes / (relator.likes + relator.dislikes) 
                    : 0.5;
                
                // Add a baseline score (e.g., 5 points) scaled by community approval
                score += (5 * approval); 
            }
        }
    }

    // 3. Process User Specific Tags (Primary Recommendation)
    for (const ut of userProfile) {
        const relator = contentRelators.find(r => r.TagId === ut.TagId);

        let matchValue = 0;
        if (relator) {
            const communityTotal = relator.likes + relator.dislikes;
            const communityApproval = communityTotal > 0 ? relator.likes / communityTotal : 0.5;
            
            // Higher weight for user profile (e.g., multiplier of 10)
            matchValue = ut.likingLevel * communityApproval;
        }

        if (rejectedTagIds.includes(ut.TagId)) matchValue *= 0.2; 
        score += matchValue;

        // Neighbor/Linked Tag logic
        const targetTag = (tag as Tag[]).find(t => t.id === ut.TagId);
        if (targetTag?.linkedWith?.length) {
            const neighborRelators = relators.filter(r => 
                r[contentKey] === contentId && targetTag.linkedWith.includes(r.TagId)
            );
            score += neighborRelators.length * 0.5;
        }
    }

    if (isDisliked) score -= 100;
    return score;
}

// ==========================================
// 1. ANALOGY MODULE
// ==========================================

export async function GetBestAnalogy(targetId: string, type: 'paragraph' | 'lesson', userId: string): Promise<Analogy | null> {
    if (!targetId || !userId) return null;
    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const userHistory = (userAnalogy as UserAnalogy[]).filter(ua => ua.UserId === userId);
    const flaggedIds = userHistory.filter(ua => ua.flaged).map(ua => ua.AnalogyId);
    const dislikedIds = userHistory.filter(ua => ua.status === 'dislike').map(ua => ua.AnalogyId);

    const candidates = (analogy as Analogy[]).filter(item => 
        (type === 'paragraph' ? item.ParagraphId === targetId : item.lessonId === targetId) && !flaggedIds.includes(item.id)
    );

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'AnalogyId', tagRelatorAnalogy, userProfile, [], dislikedIds.includes(item.id));
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}

export async function ChangeToBestAnalogy(currentAnalogyId: string, userId: string): Promise<Analogy | null> {
    const current = (analogy as Analogy[]).find(a => a.id === currentAnalogyId);
    if (!current) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const userHistory = (userAnalogy as UserAnalogy[]).filter(ua => ua.UserId === userId);
    const flaggedIds = userHistory.filter(ua => ua.flaged).map(ua => ua.AnalogyId);
    const rejectedTagIds = (tagRelatorAnalogy as TagRelatorAnalogy[]).filter(tr => tr.AnalogyId === currentAnalogyId).map(tr => tr.TagId);

    const candidates = (analogy as Analogy[]).filter(item => 
        item.defaultAnalogyId === current.defaultAnalogyId && item.id !== currentAnalogyId && !flaggedIds.includes(item.id)
    );

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'AnalogyId', tagRelatorAnalogy, userProfile, rejectedTagIds);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}


export async function GetBestParagraph(realParagraphId: string, userId: string): Promise<RealParagraph | null> {
    const base = (realParagraph as RealParagraph[]).find(p => p.id === realParagraphId);
    if (!base || !userId) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const candidates = (realParagraph as RealParagraph[]).filter(p => p.MasterParagraphId === base.MasterParagraphId);

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'ParagraphId', tagRelatorParagraph, userProfile);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}

export async function ChangeToBestParagraph(currentRealParagraphId: string, userId: string): Promise<RealParagraph | null> {
    const current = (realParagraph as RealParagraph[]).find(p => p.id === currentRealParagraphId);
    if (!current || !current.MasterParagraphId) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const candidates = (realParagraph as RealParagraph[]).filter(item => 
        item.MasterParagraphId === current.MasterParagraphId && item.id !== currentRealParagraphId
    );

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'ParagraphId', tagRelatorParagraph, userProfile);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}



export async function GetBestSummery(lessonId: string, userId: string): Promise<Summery | null> {
    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const candidates = (summery as Summery[]).filter(item => item.LessonId === lessonId);

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'SummeryId', tagRelatorSummery, userProfile);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}

export async function ChangeToBestSummery(currentSummeryId: string, userId: string): Promise<Summery | null> {
    const current = (summery as Summery[]).find(s => s.id === currentSummeryId);
    if (!current) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const candidates = (summery as Summery[]).filter(item => 
        item.DefaultSummeryId === current.DefaultSummeryId && item.id !== currentSummeryId
    );

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'SummeryId', tagRelatorSummery, userProfile);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}


export async function GetBestKeyWord(keywordId: string, userId: string): Promise<KeyWord | null> {
    const base = (keyword as KeyWord[]).find(k => k.id === keywordId);
    if (!base) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    // Note: keyword table uses "word" to group versions
    const versions = (keyword as KeyWord[]).filter(k => k.word === base.word);

    let winner = null; let topScore = -Infinity;
    for (const item of versions) {
        const score = calculateScore(item.id, 'KeyWordsId', tagRelatorKeyWords, userProfile);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}

export async function ChangeToBestKeyWord(currentKeyWordId: string, userId: string): Promise<KeyWord | null> {
    const current = (keyword as KeyWord[]).find(k => k.id === currentKeyWordId);
    if (!current) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const candidates = (keyword as KeyWord[]).filter(item => item.word === current.word && item.id !== currentKeyWordId);

    let winner = null; let topScore = -Infinity;
    for (const item of candidates) {
        const score = calculateScore(item.id, 'KeyWordsId', tagRelatorKeyWords, userProfile);
        if (score > topScore) { topScore = score; winner = item; }
    }
    return winner;
}

export async function GetBestNote(lessonId: string, userId: string): Promise<Note | null> {
    if (!lessonId || !userId) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const history = (userNote as UserNote[]).filter(un => un.UserId === userId);
    
    // Safety check: Filter out flagged or disliked notes
    const flaggedIds = history.filter(un => un.flaged).map(un => un.NoteId);
    const dislikedIds = history.filter(un => un.status === 'dislike').map(un => un.NoteId);

    // Filter candidates for this lesson
    const candidates = (note as Note[]).filter(item => 
        item.LessonId === lessonId && !flaggedIds.includes(item.id)
    );

    let winner = null; 
    let topScore = -Infinity;

    for (const item of candidates) {
        const score = calculateScore(
            item.id, 
            'NoteId', 
            tagRelatorNote, 
            userProfile, 
            [], 
            dislikedIds.includes(item.id)
        );

        if (score > topScore) { 
            topScore = score; 
            winner = item; 
        }
    }
    return winner;
}

/**
 * Switches the current note to a different personalized version
 * while avoiding the tags that characterize the note the user just rejected.
 */
export async function ChangeToBestNote(currentNoteId: string, userId: string): Promise<Note | null> {
    const current = (note as Note[]).find(n => n.id === currentNoteId);
    // We assume Note has a reference to its parent/default via 'DefaultNoteId' or similar mapping logic
    if (!current) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const history = (userNote as UserNote[]).filter(un => un.UserId === userId);
    const flaggedIds = history.filter(un => un.flaged).map(un => un.NoteId);

    // Identify tags linked to the note the user is "skipping" to avoid similar ones
    const rejectedTagIds = (tagRelatorNote as TagRelatorNote[])
        .filter(tr => tr.NoteId === currentNoteId)
        .map(tr => tr.TagId);

    // Find other versions belonging to the same lesson/default context
    const candidates = (note as Note[]).filter(item => 
        item.LessonId === current.LessonId && 
        item.id !== currentNoteId && 
        !flaggedIds.includes(item.id)
    );

    let winner = null; 
    let topScore = -Infinity;

    for (const item of candidates) {
        const score = calculateScore(
            item.id, 
            'NoteId', 
            tagRelatorNote, 
            userProfile, 
            rejectedTagIds
        );

        if (score > topScore) { 
            topScore = score; 
            winner = item; 
        }
    }
    return winner;
}