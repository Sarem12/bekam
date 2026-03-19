import { GetBestSummery, ChangeToBestSummery } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { 
    Summery, UserSummery, Lesson, 
    User, Tag, TagRelatorSummery 
} from "@/lib/types";
import { 
    user, lesson, summery, summeryOut, 
    userSummery, userSummeryOut, tag, 
    tagRelatorSummery, tagRelatorSummeryOut 
} from "@/datarelated/data";
import { stringifyLesson } from "@/lib/stringifiers";

export async function GetSummery(UserId: string, lessonId: string) {
    const bestSum = await GetBestSummery(lessonId, UserId);
    
    if (bestSum !== null) {
        const s = (summery as Summery[]).find(x => x.id === bestSum.id);
        if (s) {
            s.views += 1;
            summeryOut(summery);
        }
        return { content: bestSum.content, id: bestSum.id };
    }

    const CurrentUser = user.find(u => u.id === UserId) as User;
    const CurrentLesson = (lesson as Lesson[]).find(l => l.id === lessonId);
    if (!CurrentLesson) return { error: "Lesson not found" };

    const response = await generateContent({
        requestType: 'summary',
        user: CurrentUser,
        target: stringifyLesson(CurrentLesson)
    });

    if (response.error) return response;

    const timestamp = Date.now();
    const sumId = `sum-${timestamp}`;

    const newSum: Summery = {
        id: sumId,
        content: response.content,
        LessonId: lessonId,
        UnitId: CurrentLesson.unitId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        createdAt: new Date().toISOString(),
    };

    userSummery.push({
        id: `us-${timestamp}`, UserId, SummeryId: sumId,
        status: 'neutral', flaged: false, onuse: true, 
        lastSeenAt: new Date().toISOString(), skiped: false
    });

    summery.push(newSum);
    summeryOut(summery);
    userSummeryOut(userSummery);
    return { ...response, id: sumId };
}

export async function ChangeSummery(currentSumId: string, userId: string) {
    const currentUS = (userSummery as UserSummery[]).find(us => 
        us.UserId === userId && us.SummeryId === currentSumId
    );
    
    if (currentUS) {
        currentUS.skiped = true;
        currentUS.onuse = false;
        userSummeryOut(userSummery);
    }

    const existingBest = await ChangeToBestSummery(currentSumId, userId);
    if (existingBest !== null) {
        const s = (summery as Summery[]).find(x => x.id === existingBest.id);
        if (s) s.views += 1;
        summeryOut(summery);
        return { content: existingBest.content, id: existingBest.id };
    }

    const ref = (summery as Summery[]).find(s => s.id === currentSumId);
    return await GetSummery(userId, ref?.LessonId || "");
}