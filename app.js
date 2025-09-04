const add = document.querySelector(".add-friend");
const friendList = document.querySelector(".friends-list");
const send = document.querySelector(".send");
const chatWindow = document.querySelector(".chat-window");
const msgNode = document.querySelector(".chat-input input");
const chatHeader = document.querySelector(".chat-header");
const searchInput = document.querySelector(".search-box");
const emojiBtn = document.querySelector(".emoji-btn");
const emojiPanel = document.querySelector(".emoji-panel");


const emojis = [
    "😀", "😂", "😊", "😍", "😎", "😢", "😡", "👍", "👎", "🎉", "❤️", "🤔", "😴", "😇", "😜",
    "😱", "🤯", "🥳", "🤩", "😅", "😋", "🤗", "🙌", "💔", "💖", "💪", "👏", "🤝", "🤑", "🤤", "😏",
    "🥰", "😳", "🤭", "😞", "😤", "🥵", "🥶", "🤪", "🤠", "🫠"
];


const replies = {
    "hi": "Hello ",
    "hello": "Hi there!",
    "how are you": "I'm good, thanks for asking ",
    "what's up": "Nothing much, just chatting here ",
    "bye": "Goodbye! 👋",
    "good morning": "Good morning ☀️",
    "good night": "Good night 🌙",
    "thanks": "You're welcome 🙌",
    "tell me a joke": "Why don’t programmers like nature? Too many bugs 😂",
    "i am bored": "Let’s chat! Or I can tell you a fun fact ",
    "fun fact": "Did you know? JavaScript was created in just 10 days ⚡",
    "do you like me": "Of course, I’m always here for you ❤️",
    "what are you doing": "Just waiting to chat with you ⏳",
    "ok": "Okay 👍",
    "nice": "Glad you think so 😎",
    "cool": "Cool cool 😎",
    "lol": "Haha 😂 that’s funny!",
    "good afternoon": "Good afternoon",
    "give money": "Go to hell",
    "happy birthday": "Thank You 💕",
    "happy anniversary": "Thank You! 💕",
    "nice to meet you": "Nice to meet you too! 😄"
};


add.addEventListener("click", () => {
    const newFriend = prompt("Enter New Friend name :- ");
    if (newFriend && newFriend.trim() !== "") {
        const div = document.createElement("div");
        div.classList.add("friend");
        div.innerText = newFriend.trim();
        friendList.appendChild(div);
    }
});


send.addEventListener("click", () => {
    const userMsg = msgNode.value.trim();
    if (userMsg === "") {
        return;
    }

    addMessage(userMsg, "sent");
    msgNode.value = "";

    setTimeout(() => {
        const reply = replies[userMsg.toLowerCase()];
        addMessage(reply || "Got it", "received");
    }, 1000);
});


function addMessage(message, type = "sent") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type);
    msgDiv.textContent = message;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const friendName = chatHeader.innerText;
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");

    if (!chatHistory[friendName]) {
        chatHistory[friendName] = [];
    }

    chatHistory[friendName].push({ message, type, timestamp: new Date().getTime() });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}


friendList.addEventListener("click", (e) => {
    if (e.target.classList.contains("friend")) {
        chatHeader.innerText = e.target.innerText;
        loadMessages(e.target.innerText);
    }
});


function loadMessages(friendName) {
    chatWindow.innerHTML = "";
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");

    if (chatHistory[friendName]) {
        chatHistory[friendName].forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", msg.type);
            msgDiv.textContent = msg.message;
            chatWindow.appendChild(msgDiv);
        });
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
}


searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();
    const allFriends = document.querySelectorAll(".friend");
    allFriends.forEach(friend => {
        const name = friend.textContent.toLowerCase();
        friend.style.display = name.includes(value) ? "block" : "none";
    });
});


emojis.forEach(emoji => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.addEventListener("click", () => {
        msgNode.value += emoji;
        msgNode.focus();
    });
    emojiPanel.appendChild(span);
});


emojiBtn.addEventListener("click", () => {
    emojiPanel.style.display = emojiPanel.style.display === "none" ? "flex" : "none";
});


document.addEventListener("click", (e) => {
    if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
        emojiPanel.style.display = "none";
    }
});


const deleteBtn = document.querySelector(".delete-all");

deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete all chat history?");
    if (!confirmDelete) {
        return;
    }
    localStorage.removeItem("chatHistory");
    chatWindow.innerHTML = "";
    alert("All chat history deleted!");
});


const deleteChatBtn = document.querySelector(".delete-chat");
deleteChatBtn.addEventListener("click", () => {
    const friend = chatHeader.innerText;
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");

    if (!chatHistory[friend] || chatHistory[friend].length === 0) {
        alert(`No chat history with ${friend} to delete!`);
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete chat with ${friend}?`);
    if (!confirmDelete) return;

    delete chatHistory[friend];
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    chatWindow.innerHTML = "";
    alert(`Chat with ${friend} deleted!`);
});
