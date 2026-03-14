import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. --- TYPES (Aligned with Prisma Schema) ---
export type PromptType = 'analogy' | 'keyword' | 'summary' | 'paragraph';

export type UserProfile = {
    gender: 'MALE' | 'FEMALE';
    age: number;
    tags: string[]; // These are the Tag names from your DB
};

export type MasterParagraph = {
    content: string;
    lessonId: string;
};

export type Lesson = {
    title: string;
    paragraphs: MasterParagraph[];
};

export type Unit = {
    title: string;
    lessons: Lesson[];
};

// 2. --- SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const CURRENT_MODEL = "gemini-2.5-flash-lite";

// 3. --- CORE FUNCTIONS ---

export async function generateContent(payload: {
    user: UserProfile;
    target: MasterParagraph | Lesson | Unit;
    requestType: PromptType;
}) {
    const model = genAI.getGenerativeModel({
        model: CURRENT_MODEL,
        generationConfig: { responseMimeType: "application/json" }
    });

    const textToProcess = 'content' in payload.target ? payload.target.content : JSON.stringify(payload.target);

    const jsonSchemas: Record<PromptType, string> = {
        summary: `{ "summary": "string" }`,
        paragraph: `{ "personalized": "string" }`,
        analogy: `{ "content": "string", "logic": "string", "interestContext": "string" }`,
        keyword: `{ "keywords": [{ "word": "string", "definition": "string" }] }`
    };

    let taskInstructions = "";
    switch (payload.requestType) {
        case 'paragraph':
            taskInstructions = `
                REWRITE the text using technical/systemic vocabulary (e.g., storage, execution, transmission).
                STRICT RULE: No analogies. Do NOT use "like", "as", "similar to", or "think of". 
                Describe the biological process as a direct technical operation.`;
            break;
        case 'keyword':
            taskInstructions = `
               IDENTIFY core technical terms.
               DEFINE them by mapping their function to the user's mental model (${payload.user.tags.join(", ")}).
               STRICT RULES:
               1. No "is like" or "think of".
               2. State what the term IS as a functional component of a system.
               3. Use systemic vocabulary (e.g., storage, execution, protocol, data).`;
            break;
        case 'analogy':
            taskInstructions = `
                CREATE a direct metaphor using the user's interests: ${payload.user.tags.join(", ")}. 
                Explain the unknown using the known.`;
            break;
        case 'summary':
            taskInstructions = `Summarize the content in 1-2 sentences using vocabulary familiar to the user.`;
            break;
    }

    const finalPrompt = `
        ACT AS: Bekam, a cognitive learning architect.
        USER_INTERESTS: ${payload.user.tags.join(", ")}
        
        TASK: ${taskInstructions}
        SOURCE_TEXT: "${textToProcess}"

        STRICT RULES:
        - Return ONLY JSON.
        - No conversational filler.
        - Absolute technical accuracy.

        OUTPUT_FORMAT: ${jsonSchemas[payload.requestType]}
    `;

    try {
        const result = await model.generateContent(finalPrompt);
        return JSON.parse(result.response.text());
    } catch (e) {
        console.error("Bekam AI Error:", e);
        return { error: "Failed to generate." };
    }
}
export async function getTagsFromAI(userBio: string, existingTags: string[]) {
  try {
    if (userBio.length < 10) return []; // Too short to have "main points"

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.3 // Slightly higher to catch more "variety" in hobbies
      }
    });

    const prompt = `
      USER_BIO: "${userBio}"
      EXISTING_DATABASE_TAGS: ${JSON.stringify(existingTags)}

      TASK: 
      Identify and extract all distinct interests, hobbies, or professional fields mentioned. 
      Do not follow a strict word-to-tag ratio—focus on capturing the "Main Points" of their identity.

      RULES:
      1. EXTRACT ALL: If they mention 5 different hobbies in 20 words, extract all 5.
      2. MAPPING: Convert specific titles to general categories (e.g., "Call of Duty" -> "Gaming", "Star Wars" -> "Sci-Fi").
      3. DATABASE SYNC: Use names from EXISTING_DATABASE_TAGS if they match the user's intent.
      4. MAX LIMIT: Cap the output at 10 tags total to prevent database clutter.
      5. OUTPUT: Return only a JSON array of strings.
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text()) as string[];

  } catch (e) {
    console.error("Bekam Tagging Error:", e);
    return [];
  }
}
async function runBiologyExperiment() {
    console.log("🧪 Running Subconscious Personalization: Biology x Computer Science");

    const mockUser: UserProfile = {
        gender: 'MALE',
        age: 21,
        tags: ["Computer"]
    };

    const rnaParagraph: MasterParagraph = {
        lessonId: "cls123",
        content: "DNA (Deoxyribonucleic acid) is a molecule that carries genetic instructions for the development and functioning of living organisms. RNA (Ribonucleic acid) acts as a messenger, carrying instructions from DNA for controlling the synthesis of proteins."
    };

    // Test Paragraph Personalization (Subconscious)
    console.log("\n--- 📝 PERSONALIZED PARAGRAPH (Subconscious) ---");
    const paragraphResult = await generateContent({
        user: mockUser,
        target: rnaParagraph,
        requestType: 'paragraph'
    });
    console.log(paragraphResult);

    // Test Analogy (Direct Metaphor)
    console.log("\n--- 🧠 DIRECT ANALOGY ---");
    const analogyResult = await generateContent({
        user: mockUser,
        target: rnaParagraph,
        requestType: 'analogy'
    });
    console.log(analogyResult);
    console.log("\n--- 🔑 KEYWORDS ---");
    const keywordResult = await generateContent({
        user: mockUser,
        target: rnaParagraph,
        requestType: 'keyword'
    });
    console.log(keywordResult);
}

runBiologyExperiment();