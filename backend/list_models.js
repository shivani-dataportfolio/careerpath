const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
    
    try {
        console.log("Listing models...");
        const response = await axios.get(url);
        console.log("Success! Models available:");
        console.log(response.data.models.map(m => m.name));
    } catch (e) {
        console.error("List models failed:", e.response ? e.response.data : e.message);
    }
}

listModels();
