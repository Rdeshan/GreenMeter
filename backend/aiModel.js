require ("dotenv/config");
//chamika

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 0.4,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [{
        role: "user",
        parts:[
          {
            text: `You are GreenMeter AI, a chat assistant for an energy cost tracking app.
Only answer questions related to household energy costs, usage, devices, and energy-saving tips.
If a user asks something unrelated, reply exactly with:
"The texts you entered cannot be recognized as energy cost related!"

Your response must ALWAYS be valid JSON with this structure:
{
  "answer": "<short, clear response to the user's question>",
  "tips": ["<specific tip 1>", "<specific tip 2>", "..."],
  "summary": "<optional short summary if relevant>"
}

Do not include markdown, backticks, or any extra formatting.
Return JSON only — no other text.`
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Okay, I'm ready to answer energy cost related questions.",
          },
        ],
      }],
      
    });
  
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text();
  }
  
  //run();
  module.exports = run;