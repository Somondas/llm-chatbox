import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { createClient } from "@supabase/supabase-js";

const openAIApiKey = process.env.OPENAI_API_KEY;
const sbApiKey = process.env.SP_API_KEY;
const sbUrl = process.env.SP_URL;
const groqApiKey = process.env.GROQ_API_KEY;

// -> Create client----------------
const client = createClient(sbUrl, sbApiKey);

// >> HuggingFaceTransformerEmbeddings-----------------
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriever = vectorStore.asRetriever();

export { retriever };
