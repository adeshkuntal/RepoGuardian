const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeRepo = async (repoName, commitCount, commitMessages) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Analyze the development activity for the repository "${repoName}".
      
      Data:
      - Total recent commits fetched: ${commitCount}
      - Recent commit messages (sample): ${commitMessages.slice(0, 20).join("; ")}
      
      Based on this (and assuming general best practices), provide:
      1. A code quality review summary (max 2 sentences).
      2. 3 actionable improvement suggestions.
      3. Any potential security concerns based on commit patterns (or "None detected" if unsure).
      4. A health score out of 100 based on activity and clarity of messages.
      
      Return the response in strictly valid JSON format like:
      {
        "qualityReview": "...",
        "suggestions": ["...", "...", "..."],
        "securityConcerns": "...",
        "score": 85
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    let resultJson;
    try {
      resultJson = JSON.parse(text);
    } catch (e) {
      console.warn("JSON parse failed, attempting regex extraction...");
      // Regex fallbacks
      const scoreMatch = text.match(/"score":\s*(\d+)/);
      const qualityMatch = text.match(/"qualityReview":\s*"([^"]+)"/);

      resultJson = {
        qualityReview: qualityMatch ? qualityMatch[1] : "Analysis parsing failed.",
        suggestions: ["Could not parse specific suggestions."],
        securityConcerns: "Unknown",
        score: scoreMatch ? parseInt(scoreMatch[1]) : 50
      };
    }

    return resultJson;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback if AI fails
    return {
      qualityReview: "AI Analysis currently unavailable.",
      suggestions: ["Check back later."],
      securityConcerns: "Unknown",
      score: 50,
    };
  }
};

module.exports = {
  analyzeRepo,
};
