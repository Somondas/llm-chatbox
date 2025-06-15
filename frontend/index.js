document.addEventListener("submit", async (e) => {
  e.preventDefault();
  progressConversation();
});

async function progressConversation() {
  const userInput = document.getElementById("user-input");
  const chatbotConversation = document.getElementById(
    "chatbot-conversation-container"
  );
  const question = userInput.value;
  userInput.value = "";

  const newHumanSpeechBubble = document.createElement("div");
  newHumanSpeechBubble.classList.add("speech", "speech-human");
  newHumanSpeechBubble.textContent = question;
  chatbotConversation.appendChild(newHumanSpeechBubble);
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();

  const newAiSpeechBubble = document.createElement("div");
  newAiSpeechBubble.classList.add("speech", "speech-ai");
  newAiSpeechBubble.textContent = data.result;
  chatbotConversation.appendChild(newAiSpeechBubble);
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
