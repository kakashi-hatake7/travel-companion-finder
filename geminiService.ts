
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const analyzeDesign = async (brandName: string): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Using default analysis.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the visual style of 'The Souled Store' logo (minimalist, urban, character-driven) and explain how a brand called '${brandName}' with a black vertical suitcase logo with a purple graffiti glow captures that same urban streetwear essence while being unique. Provide the response as a short, punchy design breakdown in markdown.`,
    config: {
      temperature: 0.7,
      topP: 0.9,
    },
  });

  return response.text || "Unable to generate analysis at this time.";
};
