import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { log } from "console";
import "dotenv/config";

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

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.GROQ_API_KEY,
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
    },
    model: "text-embedding-ada-002",
  });
  await SupabaseVectorStore.fromDocuments(output, embeddings, {
    client,
    tableName: "documents",
  });
  console.log("done");
} catch (error) {
  console.log(error);
}
