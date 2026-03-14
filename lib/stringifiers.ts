import { Lesson, MasterParagraph, stringifiedContent, Unit } from "./types";
export  function stringifyLesson(Lesson: Lesson,index:string = Lesson.index.toString(),depth: number = 0): stringifiedContent{
      let text = `
       ${Lesson.title}\n` + Lesson.paragraphs.map(p => p.content).join("\n");
    if(Lesson.sublessons.length > 0) depth ++;
       for (const sub of Lesson.sublessons) {
        const subc= stringifyLesson(sub,`${index}.${sub.index}`, depth);
        text += `\n${subc.content}`;
        depth = Math.max(depth, subc.depth);
    }
    return { content: text, depth};
}

export function stringifyUnit(unit: Unit): stringifiedContent {
    let text = `Unit: ${unit.title}\n`;
    unit.lessons.forEach(lesson => {
        text += stringifyLesson(lesson).content + "\n";
    });
    return { content: text, depth: 10 };
}
export function stringifyMasterParagraph(paragraph: MasterParagraph):stringifiedContent {
    return { content: paragraph.content, depth: 0 };
}