// Load the user's API key from user_api.json
async function getUserApiKey() {
    try {
        const response = await fetch(chrome.runtime.getURL("user_api.json"));
        const data = await response.json();
        return data.GEMINI_API_KEY || null;
    } catch (error) {
        console.error("No API key found. Please add it in user_api.json.");
        return null;
    }
}

// Fetch a programming quote from Gemini API
async function getQuote() {
    const apiKey = await getUserApiKey();
    if (!apiKey) return "Make it work, make it right, make it fast.";  // Static fallback quote

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Generate a short programming quote (max 7 words). Just send the quote without any additional words. " }] }],
                generationConfig: { temperature: 1.5 }
            }),
        });

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Make it work, make it right, make it fast.";  // Static fallback quote
    } catch (error) {
        console.error("Error fetching quote:", error);
        return "Make it work, make it right, make it fast.";  // Static fallback quote
    }
}

