
import { GoogleGenAI, Type } from "@google/genai";

// Check if API key exists and is not a placeholder/empty
const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'undefined' && import.meta.env.VITE_GEMINI_API_KEY !== '';

const getAI = () => {
  if (!hasApiKey) return null;
  return new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
};

// Helper to safely extract JSON from markdown code blocks often returned by LLMs
const cleanJSON = (text: string) => {
  try {
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("JSON Parse warning, attempting loose parse", e);
    return {};
  }
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
      await new Promise(r => setTimeout(r, 1000)); // Simulate latency
      return "I'm running in Demo Mode (no API Key). I think that is a great question! In a real scenario, I would analyze your profile and give specific advice. For now, try checking the 'Internships' tab!";
    }

    const ai = getAI();
    if (!ai) return "AI Service Unavailable";

    const systemPrompt = `You are "Prashikshan Assistant", an AI career coach for the Prashikshan platform. 
    You help students find internships, improve resumes, and prepare for interviews.
    Current User Profile: ${JSON.stringify(userData)}.
    Answer concisely and helpfully. If asked about internships, suggest looking at their recommendations.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
        },
      });
      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble connecting to my brain right now. Please try again later!";
    }
  },

  async analyzeResume(resumeText: string) {
    if (!hasApiKey) {
      await new Promise(r => setTimeout(r, 2000));
      return getMockResumeAnalysis();
    }

    const ai = getAI();
    if (!ai) return null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this resume content and provide structured feedback.
        Resume Content: ${resumeText}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "strengths", "improvements"]
          }
        }
      });
      return cleanJSON(response.text || '{}');
    } catch (error: any) {
      console.error("Analysis Error:", error);
      if (error?.message?.includes('429') || error?.status === 429 || error?.toString().includes('Quota exceeded')) {
        throw new Error("QUOTA_EXCEEDED");
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
        model: 'gemini-3-flash-preview',
        contents: `Evaluate this interview answer.
        Question: ${question}
        User's Answer: ${answer}
        
        Provide constructive feedback, a better version, and a rating out of 10.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.STRING },
              betterAnswer: { type: Type.STRING },
              rating: { type: Type.NUMBER }
            },
            required: ["feedback", "betterAnswer", "rating"]
          }
        }
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
        model: 'gemini-3-flash-preview',
        contents: `The student scored ${score}/${total} (${percentage}%) in a ${domain} quiz.
        
        Create a personalized learning plan JSON.
        1. Determine level (Beginner/Intermediate/Advanced).
        2. Provide 1-sentence feedback.
        3. Identify 2 weak areas.
        4. Create 3 actionable assignments.
        5. List 3 recommended skills.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              feedback: { type: Type.STRING },
              weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              assignments: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                  }
                } 
              },
              recommendedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          }
        }
      });
      return cleanJSON(response.text || '{}');
    } catch (error) {
      console.error("Tutor Plan Error:", error);
      return null;
    }
  }
};
