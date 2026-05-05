const axios = require('axios');
require('dotenv').config();

async function testFetch() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
    
    try {
        console.log("Testing v1 with direct fetch...");
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "test" }] }]
        });
        console.log("v1 fetch success!");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error("v1 fetch failed:", e.response ? e.response.data : e.message);
    }
}

testFetch();
