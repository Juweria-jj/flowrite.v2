import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const {bullets, tone, length} = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = `Write a ${length} ${tone} college essay based on these bullets: ${bullets}`;
  
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  return Response.json({text});
}
