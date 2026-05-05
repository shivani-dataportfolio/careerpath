const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, "v1");
    try {
        // There isn't a direct listModels in the simple SDK usually, 
        // but we can try to hit an endpoint or just test a few.
        console.log("Testing models/gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("models/gemini-1.5-flash works!");
    } catch (e) {
        console.error("gemini-1.5-flash failed:", e.message);
    }

    try {
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("gemini-pro works!");
    } catch (e) {
        console.error("gemini-pro failed:", e.message);
    }
}

listModels();
