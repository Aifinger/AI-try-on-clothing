import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

// Helper to convert a URL to Base64
// Note: This will only work if the server supports CORS.
// If it fails, we might need to rely on user uploads or server-side proxy,
// but for this demo we try best-effort fetch.
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64", error);
    throw new Error("无法加载该图片，可能受跨域限制。请尝试上传本地图片。");
  }
};

export const generateClothesImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Enhanced prompt for better clothing isolation
  const enhancedPrompt = `A high-quality, professional product photography shot of ${prompt}. Flat lay on a clean white background. The clothing item should be clearly visible, centered, and well-lit.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
    });

    // Iterate to find the image part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("未生成图片数据");
  } catch (error) {
    console.error("Generate Clothes Error:", error);
    throw error;
  }
};

export const generateTryOn = async (
  personBase64: string,
  clothesBase64: string,
  userPrompt?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const basePrompt = "A realistic full-body photo of the person from the first image wearing the clothing items from the second image. The person's pose and facial features should match the first image as closely as possible. The clothing should fit naturally. High fashion photography style, 4k resolution.";
  const finalPrompt = userPrompt ? `${basePrompt} Additional details: ${userPrompt}` : basePrompt;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: personBase64,
            },
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: clothesBase64,
            },
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("未生成试穿图片");
  } catch (error) {
    console.error("Generate TryOn Error:", error);
    throw error;
  }
};
