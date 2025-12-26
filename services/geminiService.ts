
import { GoogleGenAI, Type } from "@google/genai";
import { AdParams, AdResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAdCopy = async (params: AdParams): Promise<AdResult["copy"]> => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    Generate high-converting advertisement copy for the following product/service:
    Name: ${params.productName}
    Description: ${params.description}
    Target Audience: ${params.targetAudience}
    Platform: ${params.platform}
    Tone: ${params.tone}
    CTA Style: ${params.ctaStyle}
    Creativity level (0-1): ${params.creativity}

    IMPORTANT CONSTRAINTS FOR ${params.platform.toUpperCase()}:
    - Google Ads: Headlines must be under 30 chars, Descriptions under 90 chars.
    - TikTok/Instagram: Use emojis and high-energy language.
    - LinkedIn: Maintain professional authority.
    - Facebook: Focus on community and personal benefit.
    - Email: Include engaging subject lines (as headlines).

    Return exactly 3 variations of Headlines, 2 variations of Descriptions, and 2 variations of Call-to-Actions (CTAs).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      temperature: params.creativity * 1.5, // map 0-1 to a broader creative range
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headlines: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of catchy headlines or subject lines optimized for the platform."
          },
          descriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of platform-appropriate body text or ad descriptions."
          },
          ctas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Direct or soft call to action phrases."
          }
        },
        required: ["headlines", "descriptions", "ctas"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Failed to generate ad copy. Please try again.");
  }
};
