// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { retriever } from "./utils/retriever.js";
import combineDocuments from "./utils/combileDocuments.js";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const app = express();
app.use(cors());
app.use(express.json());

// -> ENVs---------------------------------------
const openAIApiKey = process.env.OPENAI_API_KEY;
const sbApiKey = process.env.SP_API_KEY;
const sbUrl = process.env.SP_URL;
const groqApiKey = process.env.GROQ_API_KEY;

const llm = new ChatOpenAI({
  apiKey: groqApiKey,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
  model: "llama3-70b-8192",
});

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  "Generate a standalone question from the given question: {question}"
);
const answerPrompt = PromptTemplate.fromTemplate(`
You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@knowsoman.com. Don't try to make up an answer. Alaways speak as if you were chatting to a friend.
context: {context}
question: {question}
answer:
`);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());
const retriverChain = RunnableSequence.from([
  (prev) => prev.standalone_question,
  retriever,
  combineDocuments,
]);
const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: retriverChain,
    question: ({ original_input }) => original_input.question,
  },
  answerChain,
]);

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  try {
    const result = await chain.invoke({ question });
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
