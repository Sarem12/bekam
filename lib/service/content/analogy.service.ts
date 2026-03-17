import { GetBestAnalogy } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { Lesson, stringifiedContent,UserProfile } from "@/lib/types";
import { stringifyLesson, stringifyMasterParagraph, stringifyUnit } from "@/lib/stringifiers";
import { userOut,user, lesson,analogy as analogyd,analogyDefault,
    analogyDefaultOut,analogyOut,
    userAnalogy,
    userAnalogyOut,
    tag,
    universalTag,
    tagRelatorAnalogy,
    tagRelatorAnalogyOut
} from "@/datarelated/data";
import { Analogy, DefaultAnalogy,Tag,TagRelatorAnalogy,UserAnalogy } from "@/lib/temporarytype";
export async function GetAnalogy(UserId:string, contentId:string,type:'lesson'|'paragraph') {
    const analogy = await GetBestAnalogy(UserId, type,contentId);
    if (analogy === null){
        const CurrentUser  = user.find(u => u.id === UserId)! as UserProfile;
        if(type === 'lesson'){
           const CurrentLesson = (lesson as Lesson[]).find(l => l.id === contentId)!;
              const stringified = stringifyLesson(CurrentLesson);
                const response = await generateContent({
                    requestType: 'analogy',
                    user: CurrentUser,
                    target: stringified
                });
                const analogyId = `ana-${Date.now()}`;
                const defaultanalogyId = `defana-${Date.now()}`;
                const analogytags:TagRelatorAnalogy[] = []
                for (const ta of response.tagsUsed) {
                    const specificTag = tag.find(t => t.name === ta) as Tag;
                    const tagRelator: TagRelatorAnalogy = {
                        
                        id: `tagrel-${Date.now()}-${Math.random()}`,
                        TagId: specificTag.id,
                        AnalogyId: analogyId,
                        likes: 0,
                        dislikes: 0,
                        views: 0,
                        usage: 0,
                        flags: 0,
                    };
                    analogytags.push(tagRelator);
                }
                const defaultAnalogy:DefaultAnalogy = {
                    id: defaultanalogyId,
                    content: response.content,
                    logic: response.logic,
                    lessonId: contentId,
                    likes: 0,
                    dislikes: 0,
                    AnalogyId: analogyId,
                    views: 1,
                    usage: 1,
                    flags: 0,
                    createdAt: new Date().toISOString(),
                    UserId: UserId,
                    order: 0
                }
                const analogy:Analogy = {
                    id: analogyId,
                    content: response.content,
                    logic: response.logic,
                    lessonId: contentId,
                    likes: 0,
                    dislikes: 0,
                    defaultAnalogyId: defaultanalogyId,
                    views: 1,
                    usage: 1,
                    flags: 0,
                    createdAt: new Date().toISOString(),
                }
                const useranalogy:UserAnalogy = {
                    id: `userana-${Date.now()}`,
                    UserId: UserId,
                    AnalogyId: analogyId,
                    flaged: false,
                    onuse: true,
                    status: 'neutral',
                    lastSeenAt: new Date().toISOString()
                }
                
                
                analogyd.push(analogy);
                analogyDefault.push(defaultAnalogy);
                userAnalogy.push(useranalogy);
                tagRelatorAnalogy.push(...analogytags);
                analogyOut(analogyd);
                analogyDefaultOut(analogyDefault);
                userAnalogyOut(userAnalogy);
                tagRelatorAnalogyOut(tagRelatorAnalogy);
                
               
            return response; 
            }
        else if (type === 'paragraph') {
    // 1. Find the specific paragraph data
    // Assuming 'lesson' contains the paragraphs or you have a paragraph data source
    const CurrentParagraph = (lesson as Lesson[])
        .flatMap(l => l.paragraphs) // Flattening to find the right ID
        .find(p => p.id === contentId)!;

    const stringified = stringifyMasterParagraph(CurrentParagraph);

    // 2. Generate the analogy
    const response = await generateContent({
        requestType: 'analogy',
        user: CurrentUser,
        target: stringified
    });

    const analogyId = `ana-p-${Date.now()}`;
    const defaultanalogyId = `defana-p-${Date.now()}`;
    const analogytags: TagRelatorAnalogy[] = [];

    // 3. Map the guaranteed tags
    for (const ta of response.tagsUsed) {
        const specificTag = tag.find(t => t.name === ta) as Tag;
        analogytags.push({
            id: `tagrel-${Date.now()}-${Math.random()}`,
            TagId: specificTag.id,
            AnalogyId: analogyId,
            likes: 0,
            dislikes: 0,
            views: 0,
            usage: 0,
            flags: 0,
        });
    }

    // 4. Create the objects (Reusing your logic)
    const defaultAnalogy: DefaultAnalogy = {
        id: defaultanalogyId,
        content: response.content,
        logic: response.logic,
        ParagraphId: contentId, // Note: paragraphId instead of lessonId
        likes: 0,
        dislikes: 0,
        AnalogyId: analogyId,
        views: 1,
        usage: 1,
        flags: 0,
        createdAt: new Date().toISOString(),
        UserId: UserId,
        order: 0
    };

    const analogy: Analogy = {
        id: analogyId,
        content: response.content,
        logic: response.logic,
        ParagraphId: contentId,
        likes: 0,
        dislikes: 0,
        defaultAnalogyId: defaultanalogyId,
        views: 1,
        usage: 1,
        flags: 0,
        createdAt: new Date().toISOString(),
    };

    const useranalogy: UserAnalogy = {
        id: `userana-p-${Date.now()}`,
        UserId: UserId,
        AnalogyId: analogyId,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString()
    };

    // 5. Push and Save
    analogyd.push(analogy);
    analogyDefault.push(defaultAnalogy);
    userAnalogy.push(useranalogy);
    tagRelatorAnalogy.push(...analogytags);

    analogyOut(analogyd);
    analogyDefaultOut(analogyDefault);
    userAnalogyOut(userAnalogy);
    tagRelatorAnalogyOut(tagRelatorAnalogy);

    return response;
}
          
            
        
        
       
        

    } 
    return analogy;
}