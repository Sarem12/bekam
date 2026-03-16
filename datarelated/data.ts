import fs from 'fs';
import path from 'path';

// 1. --- IMPORTS ---
import analogyDefaulti from "./database/analogyDefault.json";
import analogyi from "./database/analogy.json";
import lessoni from "./database/lesson.json";
import masterParagraphi from "./database/masterParagrpah.json";
import paragraphi from "./database/paragraph.json";
import realParagraphi from "./database/realParagraph.json";
import summeryi from "./database/summery.json";
import tagi from "./database/tag.json";
import tagRelatori from "./database/tagRelator.json";
import tagUseri from "./database/tagUser.json";
import uniti from "./database/unit.json";
import useri from "./database/user.json";
import userAnalogyi from "./database/userAnalogy.json";

// ADD THESE (Create these .json files in your database folder if they don't exist)
import userSummeryi from "./database/userSummery.json";
import keywordi from "./database/keyword.json";
import keywordsi from "./database/keywords.json";
import userKeyWordsi from "./database/userKeyWords.json";
import universakTagi from "./database/universalTag.json";
// 2. --- FACTORY FUNCTION ---
export function Create(inp: any) {
    return {
        data: inp.data,
        out: (newData: any) => {
            try {
                const filePath = path.join(process.cwd(), "database", `${inp.name}.json`);
                const jsonString = JSON.stringify({ name: inp.name, data: newData }, null, 2);
                fs.writeFileSync(filePath, jsonString, 'utf-8');
                console.log(`✅ ${inp.name}.json has been updated!`);
            } catch (error) {
                console.error(`❌ Failed to update ${inp.name}.json:`, error);
            }
        }
    };
}

// 3. --- EXPORTS ---

// Core Entities
export const { data: analogyDefault, out: analogyDefaultOut } = Create(analogyDefaulti);
export const { data: analogy, out: analogyOut } = Create(analogyi);
export const { data: lesson, out: lessonOut } = Create(lessoni);
export const { data: masterParagraph, out: masterParagraphOut } = Create(masterParagraphi);
export const { data: paragraph, out: paragraphOut } = Create(paragraphi);
export const { data: realParagraph, out: realParagraphOut } = Create(realParagraphi);
export const { data: summery, out: summeryOut } = Create(summeryi);
export const { data: tag, out: tagOut } = Create(tagi);
export const { data: tagUser, out: tagUserOut } = Create(tagUseri);
export const { data: unit, out: unitOut } = Create(uniti);
export const { data: user, out: userOut } = Create(useri);

// User Interaction Data
export const { data: userAnalogy, out: userAnalogyOut } = Create(userAnalogyi);
export const { data: userSummery, out: userSummeryOut } = Create(userSummeryi);
export const { data: userKeyWords, out: userKeyWordsOut } = Create(userKeyWordsi);

// Keyword Data
export const { data: keyword, out: keywordOut } = Create(keywordi);
export const { data: keywords, out: keywordsOut } = Create(keywordsi);

// Relators (Fixing the "Member not found" errors)
// We map all specific relator imports to the main tagRelator data
export const { data: tagRelator, out: tagRelatorOut } = Create(tagRelatori);
export const tagRelatorAnalogy = tagRelator;
export const tagRelatorParagraph = tagRelator;
export const tagRelatorSummery = tagRelator;
export const tagRelatorKeyWords = tagRelator;
export const { data: universalTag, out: universalTagOut } = Create(universakTagi);