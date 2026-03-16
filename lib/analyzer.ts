import { Analogy, Tag, TagRelator, UserTag, UserAnalogy } from "./temporarytype";
import { analogy, tagUser, tagRelator, tag, userAnalogy } from "@/datarelated/data";

// --- HELPER SCORING FUNCTION ---
export function calculateAnalogyScore(
    ana: Analogy, 
    userProfile: UserTag[], 
    rejectedTagIds: string[] = [],
    isDisliked: boolean = false
): number {
    let currentScore = 0;

    for (const ut of userProfile) {
        const relator = (tagRelator as TagRelator[]).find(tr => 
            tr.AnalogyId === ana.id && tr.TagId === ut.TagId
        );

        let matchValue = 0;
        if (relator) {
            const communityTotal = relator.likes + relator.dislikes;
            const communityApproval = communityTotal > 0 ? relator.likes / communityTotal : 0.5;
            matchValue = ut.likingLevel * communityApproval;
        }

        // Penalty for "Tag Fatigue"
        if (rejectedTagIds.includes(ut.TagId)) {
            matchValue *= 0.2; 
        }

        currentScore += matchValue;

        // Personality Neighbor Logic
        const targetTag = (tag as Tag[]).find(t => t.id === ut.TagId);
        if (targetTag?.linkedWith?.length) {
            const neighborRelators = (tagRelator as TagRelator[]).filter(tr => 
                tr.AnalogyId === ana.id && targetTag.linkedWith.includes(tr.TagId)
            );
            currentScore += neighborRelators.length * 0.5;
        }
    }

    if (isDisliked) {
        currentScore -= 100;
    }

    return currentScore;
}

// --- MAIN FUNCTIONS ---

export async function GetBestAnalogy(
    targetId: string | undefined | null, // GUARDED INPUT
    type: 'paragraph' | 'lesson', 
    userId: string
): Promise<Analogy | null> {

    // 1. GUARD CLAUSE: Skip if ID is missing
    if (!targetId || !userId) return null;

    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);
    const userHistory = (userAnalogy as UserAnalogy[]).filter(ua => ua.UserId === userId);
    
    const flaggedIds = userHistory.filter(ua => ua.flaged).map(ua => ua.AnalogyId);
    const dislikedIds = userHistory.filter(ua => ua.status === 'dislike').map(ua => ua.AnalogyId);

    // 2. CONTEXTUAL ROUTING
    const candidates = (analogy as Analogy[]).filter(ana => {
        const matchesContext = type === 'paragraph' 
            ? ana.ParagraphId === targetId 
            : ana.lessonId === targetId;

        return matchesContext && !flaggedIds.includes(ana.id);
    });

    if (!candidates.length) return null;

    // 3. SELECTION
    let winner: Analogy | null = null;
    let topScore = -Infinity;

    for (const ana of candidates) {
        const isDisliked = dislikedIds.includes(ana.id);
        const score = calculateAnalogyScore(ana, userProfile, [], isDisliked);

        if (score > topScore) {
            topScore = score;
            winner = ana;
        }
    }

    return winner;
}

export async function ChangeToBestAnalogy(
    initialAnalogyId: string | undefined | null, // The ID currently on screen
    userId: string 
): Promise<Analogy | null> {
    
    // 1. GUARD CLAUSE
    if (!initialAnalogyId || !userId) return null;

    // 2. FIND THE MASTER ANCHOR
    // We need to know which "group" the current analogy belongs to
    const currentAnalogy = (analogy as Analogy[]).find(a => a.id === initialAnalogyId);
    if (!currentAnalogy) return null;

    const masterId = currentAnalogy.defaultAnalogyId;

    // 3. DATA FETCHING
    const userHistory = (userAnalogy as UserAnalogy[]).filter(ua => ua.UserId === userId);
    const userProfile = (tagUser as UserTag[]).filter(ut => ut.UserId === userId);

    const flaggedIds = userHistory.filter(ua => ua.flaged).map(ua => ua.AnalogyId);
    const dislikedIds = userHistory.filter(ua => ua.status === 'dislike').map(ua => ua.AnalogyId);

    // 4. GROUP-BASED FILTERING
    // We look for any analogy that shares the same masterId
    const candidates = (analogy as Analogy[]).filter(ana => {
        const isInSameGroup = ana.defaultAnalogyId === masterId;
        const isForbidden = flaggedIds.includes(ana.id) || ana.id === initialAnalogyId;

        return isInSameGroup && !isForbidden;
    });
    
    if (!candidates.length) return null;

    // 5. TAG FATIGUE (Identify why they might have rejected the previous one)
    const rejectedTagIds = (tagRelator as TagRelator[])
        .filter(tr => tr.AnalogyId === initialAnalogyId)
        .map(tr => tr.TagId);

    // 6. SCORING
    let winner: Analogy | null = null;
    let topScore = -Infinity;

    for (const ana of candidates) {
        const isDisliked = dislikedIds.includes(ana.id);
        const score = calculateAnalogyScore(ana, userProfile, rejectedTagIds, isDisliked);

        if (score > topScore) {
            topScore = score;
            winner = ana;
        }
    }

    return winner;
}