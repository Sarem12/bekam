import { Prisma,Lesson,PrismaClient,Unit,RealParagraph } from "@prisma/client";
import { stringifiedContent } from "./types";
import { prisma } from "./prisma";
export  async function stringifyLesson(Lesson: Lesson,index:string = Lesson.index.toString(),depth: number = 0): Promise<stringifiedContent>{
    const paragraphs = await prisma.realParagraph.findMany({ where: { LessonId: Lesson.id } })
    let text = `
       ${Lesson.title}\n` + paragraphs.map(p => p.content).join("\n");
       const sublessons = await prisma.lesson.findMany({ where: { ParentLessonId: Lesson.id } })
       if(sublessons.length > 0) depth ++;
       for (const sub of sublessons) {
        const subc= await stringifyLesson(sub,`${index}.${sub.index}`, depth);
        text += `\n${subc.content}`;
        depth = Math.max(depth, subc.depth);
    }
    return { content: text, depth};
}

export async function stringifyUnit(unit:Prisma.UnitGetPayload<{
   include: { lessons: true }
}>):Promise<stringifiedContent> {
    let text = `Unit: ${unit.title}\n`;
 const lessonsInUnit = unit.lessons
    lessonsInUnit.forEach(async lesson => {
        text += (await stringifyLesson(lesson)).content + "\n";
    });
    return { content: text, depth: 10 };
}
export function stringifyDefaultParagraph(paragraph:RealParagraph ):stringifiedContent {
    return { content: paragraph.content, depth: 0 };
}