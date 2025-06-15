import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

const groqApiKey = process.env.GROQ_API_KEY;

const llm = new ChatOpenAI({
  apiKey: groqApiKey,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1", // 👈 this is required
  },
  model: "llama3-70b-8192", // ✅ Use one of Groq’s supported models
});

const tweetTemplate =
  "Generate a standalone question from the given question: {productDesc}";

const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

const formatted = await tweetPrompt.format({
  productDesc:
    "Some shirts fits on me while others don't, so can I know the return policy of the shop, so that everything runs smoothly?",
});

const result = await llm.invoke(formatted);
console.log(result.content);
