const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector('#delete-btn')


let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight
const loadDataFromLocalStroge = () =>{
  const themeColor = localStorage.getItem("theme-color")
  document.body.classList.toggle("light-mode", themeColor === "light_mode");
  localStorage.setItem("theme-color", themeButton.innetText);
  themeButton.innerText = document.body.classList.contains("light-mode")
  ? "dark_mode"
  : "light_mode"

  const defaultText = `<div class= "default-text" > 
  <h1>ChatGBT Clone</h1>
  </div>`;
  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText
  chatContainer.scrollTo(0, chatContainer.scrollHeight)
}
loadDataFromLocalStroge()


const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  //api talebi için özellik ve verileri tanımlama
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };
  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent= response.choices[0].text.trim();
  } catch (error) {
    console.log(error);
    pElement.textContent = "opppss",
    pElement.style.color = "red" 
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement)
};

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="image/chatgpt-logo-white-green-background-png.png" alt="">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
        <span class="material-symbols-outlined">
          content_copy
          </span>
    </div>
</div>`;
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
  localStorage.setItem("all-chats", chatContainer.innerHTML);

};

const handleOutgoingchat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;
  const html = ` <div class="chat-content">
<div class="chat-details">
    <img src="image/ekip6.jpg" alt="">
    <p>
    ${userText}
    </p>
</div>
</div>`;
  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
  chatInput.innerText="";
};
themeButton.addEventListener("click", () =>{
 document.body.classList.toggle("light-mode")
 localStorage.setItem("theme-color", themeButton.innerText);
 themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"
})

deleteButton.addEventListener("click", () =>{
if(confirm ("Tüm sohbetleri silmek istediğinizden emin misinzi?"))
localStorage.removeItem("all-chats")
loadDataFromLocalStroge()
});

chatInput.addEventListener("input", () =>{
  chatInput.style.height = `${initialHeight}px`
  chatInput.style.height = `${chatInput.scrollHeight}px`
})
chatInput.addEventListener("keydown", (e) =>{
 if (e.key === "Enter")  {
  e.preventDefault();
  handleOutgoingchat();
 }
})

sendButton.addEventListener("click", handleOutgoingchat); 
