import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { log } from "console";
import "dotenv/config";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

// >> Starter Code --------------------
document.addEventListener("submit", (e) => {
  e.preventDefault();
  progressConversation();
});

const openAIApiKey = process.env.OPENAI_API_KEY;

async function progressConversation() {
  const userInput = document.getElementById("user-input");
  const chatbotConversation = document.getElementById(
    "chatbot-conversation-container"
  );
  const question = userInput.value;
  userInput.value = "";

  // add human message
  const newHumanSpeechBubble = document.createElement("div");
  newHumanSpeechBubble.classList.add("speech", "speech-human");
  chatbotConversation.appendChild(newHumanSpeechBubble);
  newHumanSpeechBubble.textContent = question;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

  // add AI message
  const newAiSpeechBubble = document.createElement("div");
  newAiSpeechBubble.classList.add("speech", "speech-ai");
  chatbotConversation.appendChild(newAiSpeechBubble);
  newAiSpeechBubble.textContent = result;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
// >> Starter Code End----------------------------------------
try {
  const text = await readFile("soman-info.txt", "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });

  const output = await splitter.createDocuments([text]);

  const sbApiKey = process.env.SP_API_KEY;
  const sbUrl = process.env.SP_URL;
  const openAIApiKey = process.env.OPENAI_API_KEY;

  const client = createClient(sbUrl, sbApiKey);

  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "sentence-transformers/all-MiniLM-L6-v2",
  });

  await SupabaseVectorStore.fromDocuments(output, embeddings, {
    client,
    tableName: "documents",
  });
  console.log("✅ Done indexing to Supabase with HuggingFace embeddings");
} catch (error) {
  console.log(error);
}
