// -> Grammar, punctuation ----------------------------------

const punctuationTemplate = `Given a sentence, add punctuation where needed.
sentence: {sentence}
sentence with puntuation:

`;

const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentence correct the grammar.
sentence: {punctuated_sentence}
sentence with correct grammar:
`;

const grammarPormpt = PromptTemplate.fromTemplate(grammarTemplate);

const translationTemplate = `Given a sentence, translate that sentence into {language} sentence: {grammatically_correct_sentence}
translated sentence: 
`;

const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);
const punctuationChain = RunnableSequence.from([
  punctuationPrompt,
  llm,
  new StringOutputParser([]),
]);

const grammarChain = RunnableSequence.from([
  grammarPormpt,
  llm,
  new StringOutputParser(),
]);

const translationChain = RunnableSequence.from([
  translationPrompt,
  llm,
  new StringOutputParser(),
]);
const chain = RunnableSequence.from([
  {
    punctuated_sentence: punctuationChain,
    original_input: new RunnablePassthrough(),
  },
  {
    grammatically_correct_sentence: grammarChain,
    language: ({ original_input }) => original_input.language,
  },
  translationChain,
]);

const response = await chain.invoke({
  sentence: "i doesn't like mondoy not very much",
  language: "hindi",
});
console.log(response);

// -> Grammar, punctuation ----------------------------------
