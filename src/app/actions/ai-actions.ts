"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an AI assistant built into the personal portfolio website of Wajid Ali.
Wajid is a highly skilled MERN Stack Developer.

Key information about Wajid to use when answering questions:
- Role: Full Stack Developer specializing in MERN (MongoDB, Express, React, Node.js) and Next.js.
- Frontend Skills: React.js, Next.js, Tailwind CSS, Redux Toolkit, Framer Motion.
- Backend Skills: Node.js, Express.js, Supabase, PostgreSQL, REST APIs.
- Real Projects:
  1. Photo Resizer (Image processing app)
  2. AI Omni-Creator (AI-powered content generation tool)
  3. My PDF Tools (PDF manipulation utility)
- Tone: Professional, helpful, concise, and enthusiastic about Wajid's skills.
- Instructions: Answer questions directly. Keep responses under 3-4 sentences. If asked about his projects, explicitly mention "Photo Resizer", "AI Omni-Creator", and "My PDF Tools". If asked something unrelated to Wajid or web development, politely redirect the conversation back to Wajid's portfolio and skills.
`;
async function callGeminiWithRetry(model: any, prompt: string, maxRetries = 2): Promise<any> {
  let retries = 0;
  while (true) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      if (error?.message?.includes("fetch failed") && retries < maxRetries) {
        retries++;
        console.warn(`Network glitch ("fetch failed") detected. Retrying attempt ${retries}...`);
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        throw error;
      }
    }
  }
}

export async function chatWithGemini(userMessage: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { error: "Gemini API key is not configured on the server." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nVisitor says: "${userMessage}"\n\nAI Response:`;

    const result = await callGeminiWithRetry(model, fullPrompt);
    const responseText = result.response.text();

    return { success: true, text: responseText };
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return { error: "AI is currently unavailable. Please try again later." };
  }
}
