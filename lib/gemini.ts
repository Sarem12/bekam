import { GoogleGenerativeAI } from "@google/generative-ai";
const apikey = process.env.GOOGLE_API_KEY || "";

const genAi = new GoogleGenerativeAI(apikey);
export  async function analizeWithGemini(prompt: string,type:"sumery"|"qa"|"sentiment"|"entity"|"extract") {
    try{
        const model = genAi.getGenerativeModel({model: "gemini-3.1-flash-lite"});
    const promptMap = {
        "sumery": `Summarize the following text: ${prompt}`,
        "qa": `Answer the following question based on the provided text: ${prompt}`,
        "sentiment": `Analyze the sentiment of the following text: ${prompt}`,
        "entity": `Extract entities from the following text: ${prompt}`,
        "extract": `Extract key information from the following text: ${prompt}`
    }
    const result = await model.generateContent(promptMap[type]);
    return result.response.text;
    }
    catch(e){
        console.error("Error initializing Gemini model:", e);
        throw new Error("Failed to initialize Gemini model");
    }
}