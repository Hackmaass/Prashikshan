
import { GoogleGenAI, Type } from "@google/genai";

// Check if API key exists and is not a placeholder/empty
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
               (typeof process !== 'undefined' ? (process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY) : undefined);

const hasApiKey = !!apiKey && apiKey !== 'undefined' && apiKey !== '';

if (typeof window !== 'undefined') {
  if (!hasApiKey) {
    console.warn("Gemini API Key missing or empty.");
  } else {
    // Hidden debug info to verify key presence without leaking it
    console.log(`Gemini API Key detected (Length: ${apiKey?.length}, Prefix: ${apiKey?.substring(0, 4)}...)`);
  }
}

const getAI = () => {
  if (!hasApiKey) return null;
  // Use v1beta where gemini-1.5-flash is actually hosted
  return new GoogleGenAI({ 
    apiKey: apiKey || '',
    apiVersion: 'v1beta'
  });
};

// Helper to safely extract JSON from markdown code blocks often returned by LLMs
const cleanJSON = (text: string) => {
  try {
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("JSON Parse warning", e);
    return {};
  }
};

// Simple cache to avoid duplicate API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key: string) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log("Using cached response");
    return entry.data;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// --- MOCK DATA GENERATORS (For Demo/Fallback Mode) ---
const getMockResumeAnalysis = () => ({
  score: 82,
  strengths: [
    "Strong action verbs used throughout experience section",
    "Clear quantification of achievements (e.g., 'increased efficiency by 20%')",
    "Skills section is well-categorized and relevant"
  ],
  improvements: [
    "Add a brief professional summary at the top",
    "Ensure consistent date formatting across all entries",
    "Include links to GitHub or portfolio projects"
  ]
});

const getMockInterviewFeedback = (question: string) => ({
  feedback: "Great start! You structured your answer using the STAR method which is excellent. However, try to focus more on the 'Result' aspect. Quantify the impact of your actions where possible.",
  betterAnswer: "In my previous role, I encountered a conflict where two team members disagreed on the API architecture. I facilitated a meeting to list pros and cons of each approach. We realized a hybrid solution was best. This decision reduced our technical debt by 15% and accelerated delivery by 2 weeks.",
  rating: 8.5
});

const getMockTutorPlan = (score: number, domain: string) => ({
  level: score > 3 ? "Intermediate" : "Beginner",
  feedback: `You have a solid grasp of ${domain} fundamentals, but could improve on advanced concepts.`,
  weakAreas: ["State Management Patterns", "Performance Optimization"],
  assignments: [
    {
      title: "Refactor Context API",
      description: "Take a prop-drilled component tree and refactor it to use React Context efficiently.",
      difficulty: "Medium"
    },
    {
      title: "Implement Memoization",
      description: "Use React.memo and useMemo to optimize a heavy rendering list.",
      difficulty: "Hard"
    },
    {
      title: "Custom Hooks 101",
      description: "Create a custom hook useFetch that handles loading, error, and data states.",
      difficulty: "Easy"
    }
  ],
  recommendedSkills: ["Redux Toolkit", "Next.js", "Jest Testing"]
});

export const geminiService = {
  async getChatbotResponse(userMessage: string, userData: any) {
    if (!hasApiKey) {
      await new Promise(r => setTimeout(r, 1000));
      return "I'm running in Demo Mode (no API Key).";
    }

    const ai = getAI();
    if (!ai) return "AI Service Unavailable";

    const systemPrompt = `You are "Prashikshan Assistant", an AI career coach.
    Current User Profile: ${JSON.stringify(userData)}.
    Answer concisely.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${systemPrompt}\n\nUser Message: ${userMessage}`
      });
      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble connecting to my brain right now.";
    }
  },

  async analyzeResume(resumeText: string) {
    // Check cache first
    const cacheKey = `resume:${resumeText.slice(0, 100)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (!hasApiKey) {
      await new Promise(r => setTimeout(r, 500));
      return getMockResumeAnalysis();
    }

    const ai = getAI();
    if (!ai) return null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Analyze resume. Return JSON: {score:number, strengths:string[], improvements:string[]}
Resume: ${resumeText.slice(0, 2000)}`  // Limit input size
      });
      const result = cleanJSON(response.text || '{}');
      setCache(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error("Analysis Error:", error);
      if (error?.toString().includes('429')) {
        throw new Error('QUOTA_EXCEEDED');
      }
      return null;
    }
  },

  async getInterviewFeedback(question: string, answer: string) {
    if (!hasApiKey) {
      await new Promise(r => setTimeout(r, 1500));
      return getMockInterviewFeedback(question);
    }

    const ai = getAI();
    if (!ai) return null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Evaluate this interview answer.
        Question: ${question}
        User's Answer: ${answer}
        
        Return raw JSON with keys: feedback (string), betterAnswer (string), rating (number).`
      });
      return cleanJSON(response.text || '{}');
    } catch (error) {
      console.error("Feedback Error:", error);
      return null;
    }
  },

  async generateTutorPlan(score: number, total: number, domain: string) {
    if (!hasApiKey) {
      await new Promise(r => setTimeout(r, 1500));
      return getMockTutorPlan(score, domain);
    }

    const ai = getAI();
    if (!ai) return null;

    const percentage = (score / total) * 100;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Student scored ${score}/${total} in ${domain}.
        
        Create a learning plan.
        Return raw JSON with keys: level (string), feedback (string), weakAreas (array of strings), assignments (array of objects with title, description, difficulty), recommendedSkills (array of strings).`
      });
      return cleanJSON(response.text || '{}');
    } catch (error) {
      console.error("Tutor Plan Error:", error);
      return null;
    }
  }
};
