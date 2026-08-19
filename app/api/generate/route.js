import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const {bullets, tone, length} = await req.json();
    
    if(!process.env.GEMINI_API_KEY) {
      return Response.json({text: "ERROR: GEMINI_API_KEY not set in Vercel"}, {status: 500})
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash"});

    const prompt = `Write a ${length} ${tone} college essay based on these bullets: ${bullets}. Write like a 17 year old student.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return Response.json({text});
  } catch(e) {
    return Response.json({text: "API ERROR: " + e.message}, {status: 500})
  }
}
