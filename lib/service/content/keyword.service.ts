import { GetBestKeyWord, ChangeToBestKeyWord } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { 
    KeyWords, UserKeyWords, User, 
    Tag, TagRelatorKeyWords 
} from "@/lib/types";
import { 
    user, keywords, keywordsOut, 
    userKeyWords, userKeyWordsOut, tag, 
    tagRelatorKeyWords, tagRelatorKeyWordsOut 
} from "@/datarelated/data";

export async function GetKeyWords(UserId: string, keywordVariantId: string) {
    const bestKey = await GetBestKeyWord(keywordVariantId, UserId);
    
    if (bestKey !== null) {
        const k = (keywords as KeyWords[]).find(x => x.id === bestKey.id);
        if (k) {
            k.views += 1;
            keywordsOut(keywords);
        }
        return { content: bestKey.DefinitionId, id: bestKey.id }; 
    }

    const CurrentUser = user.find(u => u.id === UserId) as User;
    const baseVariant = (keywords as KeyWords[]).find(k => k.id === keywordVariantId);
    if (!baseVariant) return { error: "Keyword base not found" };

    const response = await generateContent({
        requestType: 'keyword',
        user: CurrentUser,
        target: { content: "Explain concept", depth: 1 }
    });

    if (response.error) return response;

    const timestamp = Date.now();
    const newKeyId = `key-${timestamp}`;

    const newKey: KeyWords = {
        id: newKeyId,
        lessonId: baseVariant.lessonId,
        ParagraphId: baseVariant.ParagraphId,
        isCoreConcept: baseVariant.isCoreConcept,
        DefinitionId: baseVariant.DefinitionId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        createdAt: new Date().toISOString(),
    };

    userKeyWords.push({
        id: `uk-${timestamp}`, UserId, KeyWordsId: newKeyId,
        status: 'neutral', flaged: false, onuse: true, 
        lastSeenAt: new Date().toISOString(), skiped: false
    });

    keywords.push(newKey);
    keywordsOut(keywords);
    userKeyWordsOut(userKeyWords);
    return { ...response, id: newKeyId };
}

export async function ChangeKeyWord(currentKeyId: string, userId: string) {
    const currentUK = (userKeyWords as UserKeyWords[]).find(uk => 
        uk.UserId === userId && uk.KeyWordsId === currentKeyId
    );
    
    if (currentUK) {
        currentUK.skiped = true;
        currentUK.onuse = false;
        userKeyWordsOut(userKeyWords);
    }

    const existingBest = await ChangeToBestKeyWord(currentKeyId, userId);
    if (existingBest !== null) {
        const k = (keywords as KeyWords[]).find(x => x.id === existingBest.id);
        if (k) k.views += 1;
        keywordsOut(keywords);
        return { content: existingBest.DefinitionId, id: existingBest.id };
    }

    return await GetKeyWords(userId, currentKeyId);
}