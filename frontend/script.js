
// =====================================
// Institute 360 - CHATBOT FUNCTIONALITY
// =====================================

// API URL
const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================
// GET HTML ELEMENTS
// =====================================

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");

const newChatBtn = document.getElementById("newChat");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const chatHistory = document.getElementById("chatHistory");
const searchChats = document.getElementById("searchChats");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");
const attachmentInfo = document.getElementById("attachmentInfo");

const voiceBtn = document.getElementById("voiceBtn");


// =====================================
// CHAT DATA
// =====================================

let chats = [];

try {
    chats = JSON.parse(localStorage.getItem("novaChats")) || [];

    if (!Array.isArray(chats)) {
        chats = [];
    }
} catch {
    chats = [];
}

let activeChatId = null;
let selectedFile = null;
let typingElement = null;


// =====================================
// SAVE CHATS
// =====================================

function saveChats() {
    localStorage.setItem("novaChats", JSON.stringify(chats));
}


// =====================================
// GET CURRENT CHAT
// =====================================

function getActiveChat() {
    return chats.find(chat => chat.id === activeChatId);
}


// =====================================
// CREATE NEW CHAT
// =====================================

function createNewChat() {

    activeChatId = null;

    messages.innerHTML = "";
    welcome.style.display = "block";

    userInput.value = "";
    userInput.style.height = "auto";

    selectedFile = null;
    fileInput.value = "";
    attachmentInfo.textContent = "";

    renderHistory();

    closeMobileSidebar();

    userInput.focus();
}


// =====================================
// SIDEBAR CONTROLS
// =====================================

function openSidebar() {

    if (window.innerWidth <= 700) {

        sidebar.classList.remove("collapsed");
        overlay.classList.add("show");

    } else {

        sidebar.classList.toggle("collapsed");

    }
}


function closeMobileSidebar() {

    if (window.innerWidth <= 700) {

        sidebar.classList.add("collapsed");
        overlay.classList.remove("show");

    }
}


menuBtn.addEventListener("click", openSidebar);


closeSidebar.addEventListener("click", () => {

    if (window.innerWidth <= 700) {

        closeMobileSidebar();

    } else {

        sidebar.classList.add("collapsed");

    }

});


overlay.addEventListener("click", closeMobileSidebar);

newChatBtn.addEventListener("click", createNewChat);


// =====================================
// CHAT HISTORY
// =====================================

function renderHistory() {

    chatHistory.innerHTML = "";

    const search = searchChats.value.toLowerCase();

    if (chats.length === 0) {

        chatHistory.innerHTML =
            '<p class="empty-history">Your conversations will appear here.</p>';

        return;
    }

    chats.forEach(chat => {

        if (!chat.title.toLowerCase().includes(search)) {
            return;
        }

        const item = document.createElement("div");
        item.className = "history-item";

        if (chat.id === activeChatId) {
            item.classList.add("active");
        }

        // CHAT TITLE

        const title = document.createElement("span");
        title.className = "history-title";
        title.textContent = chat.title;

        // OPTIONS BUTTON

        const options = document.createElement("div");
        options.className = "chat-options";

        const optionsBtn = document.createElement("button");
        optionsBtn.className = "options-btn";
        optionsBtn.textContent = "•••";
        optionsBtn.title = "Chat options";

        options.appendChild(optionsBtn);

        // OPEN CHAT

        item.addEventListener("click", () => {

            activeChatId = chat.id;

            renderChat();
            renderHistory();

            closeMobileSidebar();

        });

        // OPTIONS MENU

        optionsBtn.addEventListener("click", event => {

            event.stopPropagation();

            document.querySelectorAll(".options-menu")
                .forEach(menu => menu.remove());

            const menu = document.createElement("div");
            menu.className = "options-menu";

            const rect = optionsBtn.getBoundingClientRect();

            const menuTop = Math.min(
                rect.bottom + 5,
                window.innerHeight - 95
            );

            menu.style.top = Math.max(5, menuTop) + "px";
            menu.style.left = Math.max(5, rect.right - 135) + "px";

            // RENAME

            const renameBtn = document.createElement("button");
            renameBtn.textContent = "✎  Rename";

            renameBtn.addEventListener("click", () => {

                const newTitle = prompt(
                    "Enter a new chat name:",
                    chat.title
                );

                if (newTitle && newTitle.trim()) {

                    chat.title = newTitle.trim();

                    saveChats();
                    renderHistory();

                }

                menu.remove();

            });

            // DELETE

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "⌫  Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", () => {

                if (confirm("Delete this conversation?")) {

                    chats = chats.filter(
                        c => c.id !== chat.id
                    );

                    if (activeChatId === chat.id) {

                        activeChatId = null;

                        messages.innerHTML = "";
                        welcome.style.display = "block";

                    }

                    saveChats();
                    renderHistory();

                }

                menu.remove();

            });

            menu.appendChild(renameBtn);
            menu.appendChild(deleteBtn);

            document.body.appendChild(menu);

            setTimeout(() => {

                document.addEventListener(
                    "click",
                    function closeMenu() {

                        menu.remove();

                        document.removeEventListener(
                            "click",
                            closeMenu
                        );

                    },
                    { once: true }
                );

            }, 0);

        });

        item.appendChild(title);
        item.appendChild(options);

        chatHistory.appendChild(item);

    });

}


// SEARCH HISTORY

searchChats.addEventListener("input", renderHistory);


// =====================================
// DISPLAY CHAT
// =====================================

function renderChat() {

    messages.innerHTML = "";

    const chat = getActiveChat();

    if (!chat || chat.messages.length === 0) {

        welcome.style.display = "block";

        return;
    }

    welcome.style.display = "none";

    chat.messages.forEach(message => {

        addMessageToScreen(message.text, message.sender);

    });

    scrollToBottom();

}


// =====================================
// ADD MESSAGE TO SCREEN
// =====================================

function addMessageToScreen(text, sender) {

    const message = document.createElement("div");
    message.className = "message " + sender;

    const label = document.createElement("div");
    label.className = "message-label";

    label.textContent =
        sender === "user" ? "You" : "✦ Institute 360";

    const content = document.createElement("div");
    content.className = "message-content";

    content.textContent = text;

    message.appendChild(label);
    message.appendChild(content);

    // COPY BUTTON FOR AI ANSWERS

    if (sender === "bot") {

        const actions = document.createElement("div");
        actions.className = "message-actions";

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "▢ Copy";
        copyBtn.title = "Copy response";

        copyBtn.addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(text);

                copyBtn.textContent = "✓ Copied";

                setTimeout(() => {

                    copyBtn.textContent = "▢ Copy";

                }, 1500);

            } catch {

                alert("Unable to copy. Please select the text manually.");

            }

        });

        actions.appendChild(copyBtn);
        message.appendChild(actions);

    }

    messages.appendChild(message);

}


// =====================================
// TYPING ANIMATION
// =====================================

function showTyping() {

    typingElement = document.createElement("div");
    typingElement.className = "typing";

    for (let i = 0; i < 3; i++) {

        const dot = document.createElement("span");

        typingElement.appendChild(dot);

    }

    messages.appendChild(typingElement);

    scrollToBottom();

}


function removeTyping() {

    if (typingElement) {

        typingElement.remove();

        typingElement = null;

    }

}


// =====================================
// DEMO BOT RESPONSE
// =====================================

// Kept unchanged for future reference.
// The chatbot now gets its response from FastAPI.

function generateDemoResponse(question) {

    const q = question.toLowerCase();

    if (
        q.includes("artificial intelligence") ||
        q.includes("what is ai")
    ) {

        return "Artificial Intelligence (AI) is a technology that allows computers to perform tasks that normally require human intelligence. For example, answering questions, recognizing images and understanding language.\n\nExamples include ChatGPT, virtual assistants and recommendation systems.";

    }

    if (q.includes("machine learning")) {

        return "Machine Learning is a branch of Artificial Intelligence. It allows computers to learn patterns from data and make predictions without being explicitly programmed for every task.\n\nExamples include spam detection, movie recommendations and house price prediction.";

    }

    if (q.includes("python")) {

        return "Python is a beginner-friendly programming language used in web development, automation, data science and Artificial Intelligence.\n\nSome popular Python libraries are NumPy, Pandas, Matplotlib and Scikit-learn.";

    }

    if (q.includes("project ideas")) {

        return "Here are some project ideas:\n\n1. AI Career Guidance System\n2. Fake News Detection\n3. Student Performance Prediction\n4. Chatbot using Python\n5. Movie Recommendation System\n6. Sentiment Analysis System\n\nYou can build these using Python and machine learning.";

    }

    if (q.includes("email") || q.includes("write")) {

        return "I can help you draft professional emails, messages and documents. Please provide the topic and the details you want included.\n\nNote: This is currently a demo response, not a connected AI model.";

    }

    return "Thanks for your message! I'm currently running in demo mode.\n\nYour chatbot interface is working correctly. To receive intelligent, context-aware answers to any question, we'll connect a real AI model through a backend.\n\nYour message was: " + question;

}


// =====================================
// SEND MESSAGE - FASTAPI CONNECTION
// =====================================

async function sendMessage() {

    const text = userInput.value.trim();

    if (!text && !selectedFile) return;

    // FILE UPLOAD IS NOT SUPPORTED YET

    if (selectedFile) {

        alert("File uploads will be available in a later phase. Your file will not be uploaded.");

        selectedFile = null;
        fileInput.value = "";
        attachmentInfo.textContent = "";

        if (!text) return;

    }

    let chat = getActiveChat();

    // CREATE CHAT WHEN FIRST MESSAGE IS SENT

    if (!chat) {

        chat = {
            id: Date.now(),
            title: "New Chat",
            conversationId: null,
            messages: []
        };

        chats.unshift(chat);

        activeChatId = chat.id;

    }

    // SAVE USER MESSAGE

    chat.messages.push({
        text: text,
        sender: "user"
    });

    if (chat.title === "New Chat") {

        chat.title = text.substring(0, 35);

    }

    userInput.value = "";
    userInput.style.height = "auto";

    selectedFile = null;
    fileInput.value = "";
    attachmentInfo.textContent = "";

    welcome.style.display = "none";

    saveChats();

    renderChat();
    renderHistory();

    const chatId = chat.id;

    // SHOW TYPING ANIMATION

    showTyping();

    try {

        // SEND MESSAGE TO FASTAPI BACKEND

        const response = await fetch(
            `${API_BASE_URL}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    conversation_id: chat.conversationId || null,

                    message: text

                })
            }
        );

        if (!response.ok) {

            throw new Error("API request failed: " + response.status);

        }

        const data = await response.json();

        removeTyping();

        const currentChat = chats.find(c => c.id === chatId);

        if (!currentChat) return;

        // SAVE CONVERSATION ID

        currentChat.conversationId = data.conversation_id;

        // SAVE BOT RESPONSE

        currentChat.messages.push({
            text: data.reply,
            sender: "bot"
        });

        saveChats();

        if (activeChatId === chatId) {

            renderChat();

        }

    } catch (error) {

        removeTyping();

        const currentChat = chats.find(c => c.id === chatId);

        if (!currentChat) return;

        currentChat.messages.push({

            text: "Unable to connect to the Institute 360 server. Please check whether the backend is running and try again.",

            sender: "bot"

        });

        saveChats();

        if (activeChatId === chatId) {

            renderChat();

        }

        console.error("Chat API Error:", error);

    }

}


// =====================================
// SEND BUTTON
// =====================================

sendBtn.addEventListener("click", sendMessage);


// =====================================
// ENTER TO SEND
// =====================================

userInput.addEventListener("keydown", event => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});


// =====================================
// AUTO EXPAND TEXTAREA
// =====================================

userInput.addEventListener("input", () => {

    userInput.style.height = "auto";

    userInput.style.height =
        Math.min(userInput.scrollHeight, 140) + "px";

});


// =====================================
// SUGGESTION BUTTONS
// =====================================

document.querySelectorAll(".suggestion").forEach(button => {

    button.addEventListener("click", () => {

        userInput.value = button.dataset.prompt;

        sendMessage();

    });

});


// =====================================
// DARK MODE
// =====================================

function updateThemeButton() {

    const isDark = document.body.classList.contains("dark");

    themeIcon.textContent = isDark ? "☀" : "☾";

    themeText.textContent = isDark ? "Light mode" : "Dark mode";

}


function setTheme(isDark) {

    document.body.classList.toggle("dark", isDark);

    localStorage.setItem(
        "novaTheme",
        isDark ? "dark" : "light"
    );

    updateThemeButton();

}


themeBtn.addEventListener("click", () => {

    const isDark = !document.body.classList.contains("dark");

    setTheme(isDark);

});


setTheme(localStorage.getItem("novaTheme") === "dark");


// =====================================
// FILE ATTACHMENT
// =====================================

attachBtn.addEventListener("click", () => {

    fileInput.click();

});


fileInput.addEventListener("change", () => {

    if (fileInput.files.length > 0) {

        selectedFile = fileInput.files[0];

        attachmentInfo.textContent =
            "📎 " + selectedFile.name + " selected";

    }

});


// =====================================
// VOICE INPUT
// =====================================

let recognition = null;
let isRecording = false;

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.onresult = event => {

        const spokenText =
            event.results[0][0].transcript;

        userInput.value = (
            userInput.value + " " + spokenText
        ).trim();

        userInput.dispatchEvent(new Event("input"));

    };


    recognition.onend = () => {

        isRecording = false;

        voiceBtn.classList.remove("recording");

    };


    recognition.onerror = () => {

        isRecording = false;

        voiceBtn.classList.remove("recording");

    };

}


voiceBtn.addEventListener("click", () => {

    if (!recognition) {

        alert("Voice input is not supported in this browser.");

        return;

    }

    if (isRecording) {

        recognition.stop();

        return;

    }

    try {

        recognition.start();

        isRecording = true;

        voiceBtn.classList.add("recording");

    } catch (error) {

        alert("Please try voice input again.");

    }

});


// =====================================
// SCROLL TO BOTTOM
// =====================================

function scrollToBottom() {

    const chatArea = document.getElementById("chatArea");

    chatArea.scrollTop = chatArea.scrollHeight;

}


// =====================================
// LOAD PREVIOUS CHATS
// =====================================

renderHistory();

welcome.style.display = "block";
