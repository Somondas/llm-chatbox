import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { readFile } from "fs/promises";

try {
  const text = await readFile("soman-info.txt", "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });

  const output = await splitter.createDocuments([text]);
  console.log(output);
} catch (error) {
  console.log(error);
}
