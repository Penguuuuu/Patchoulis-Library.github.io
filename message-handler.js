const MAX_CHARS = 200;
const MAX_USERNAME_CHARS = 20;
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwLUZmpGTv6WoFhI1SIHTbc7ueWRHJUQ9hko8ukAzW0CcIYMc4iPrwHnGKm7HRr6jus/exec";

const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.querySelector('.input-message-chat');
const sendButton = document.querySelector('.button-send-chat');
const usernameInput = document.querySelector('.input-name-chat');
const charCount = document.querySelector('.char-count');
const statusMessage = document.querySelector('.status-message');
const newMessageNotification = document.querySelector('.new-message-notification');
const emojiButton = document.querySelector('.emoji-button');
const emojiPicker = document.querySelector('.emoji-picker');

let userScrolledToBottom = true;
let previousMessageCount = 0;
let messageSent = false;
let fetchInterval = 2000;

const emojis = [
    "happy.gif", "laugh.gif", "cool.gif", "grin.gif", "razz.gif",
    "wink.gif", "blush.gif", "surprised.gif", "sad.gif", "cry.gif",
    "angry.gif"
];

function initChat() {
    messageInput.value = '';
    updateCharCount();
    createEmojiPicker();
    fetchMessages(true);
    autoResizeTextarea(messageInput);
    matchUsernameInputHeight();
}

function matchUsernameInputHeight() {
    const lineHeight = window.getComputedStyle(messageInput).lineHeight;
    usernameInput.style.height = lineHeight;
}

function createEmojiPicker() {
    emojiPicker.innerHTML = '';
    emojis.forEach(emoji => {
        const img = document.createElement('img');
        img.className = 'emoji';
        img.src = `emoji/${emoji}`;
        img.alt = emoji.split('.')[0];
        img.setAttribute('data-emoji', emoji);
        emojiPicker.appendChild(img);
    });
}

function countCharacters(message) {
    return Array.from(message).length;
}

function updateCharCount() {
    const message = messageInput.value;
    const remainingChars = MAX_CHARS - countCharacters(message);
    charCount.style.display = remainingChars <= 50 ? 'block' : 'none';
    charCount.textContent = `${remainingChars} characters remaining`;
}

function isAtBottom() {
    return chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + 1;
}

function replaceEmojiTextWithImage(message) {
    return message.replace(/:([a-zA-Z0-9_]+):/g, (match, p1) => {
        const emojiFileName = `${p1.toLowerCase()}.gif`;
        return `<img src="emoji/${emojiFileName}" class="emoji-inline" alt="${p1}">`;
    });
}

async function fetchMessages(forceScroll = false) {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=fetch`);
        const data = await response.json();
        const messagesData = data.slice(1); // Ignoring the header row
        const messagesHTML = messagesData.map(({ username, message }) => 
            `<strong>${sanitizeHTML(username)}</strong>: ${replaceEmojiTextWithImage(message)}<br><br>`
        ).join('');

        chatMessages.innerHTML = messagesHTML;

        const currentMessageCount = messagesData.length;
        if (currentMessageCount > previousMessageCount && !messageSent) {
            if (!userScrolledToBottom) {
                newMessageNotification.textContent = 'New message(s)';
                newMessageNotification.style.display = 'block';
            }
        }

        if (userScrolledToBottom || forceScroll) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
            newMessageNotification.style.display = 'none';
        }

        previousMessageCount = currentMessageCount;
        messageSent = false;

        fetchInterval = currentMessageCount > previousMessageCount ? 2000 : 5000;
        scheduleNextFetch();
    } catch {
        scheduleNextFetch();
    }
}

function showStatusMessage(message, delay = 3000) {
    statusMessage.textContent = message;
    setTimeout(() => statusMessage.textContent = '', delay);
}

async function sendMessage() {
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim() || "Anonymous";

    messageInput.value = '';
    updateCharCount();
    handleTextareaReset();

    if (username.length > MAX_USERNAME_CHARS) {
        showStatusMessage('Username cannot exceed 20 characters.');
        return;
    }

    if (message.length === 0) {
        showStatusMessage('Message cannot be empty.');
        return;
    }

    if (countCharacters(message) > MAX_CHARS) {
        showStatusMessage('Message cannot exceed 200 characters.');
        return;
    }

    try {
        const response = await fetch(`${WEB_APP_URL}?action=send&username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`);
        const data = await response.text();

        if (data === "Message sent") {
            const newMessageHTML = `<strong>${sanitizeHTML(username)} - </strong>${replaceEmojiTextWithImage(message)}<br><br>`;
            chatMessages.innerHTML += newMessageHTML;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            messageSent = true;
            await fetchMessages();
        } else {
            showStatusMessage(data);
        }
    } catch {
        showStatusMessage('Error sending message.');
    }
}

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function scheduleNextFetch() {
    setTimeout(() => fetchMessages(), fetchInterval);
}

function handleTextareaReset() {
    autoResizeTextarea(messageInput);
}

function autoResizeTextarea(textarea) {
    const style = getComputedStyle(textarea);
    const lineHeight = parseFloat(style.lineHeight);
    const minHeight = lineHeight;
    
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.max(scrollHeight, minHeight);

    textarea.style.height = `${Math.round(newHeight / lineHeight) * lineHeight}px`;
}

emojiButton.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

emojiPicker.addEventListener('click', (event) => {
    const emoji = event.target.getAttribute('data-emoji');
    if (emoji) {
        const emojiName = emoji.split('.')[0].split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        messageInput.value += `:${emojiName}:`;
        updateCharCount();
        emojiPicker.style.display = 'none';
    }
});

chatMessages.addEventListener('scroll', () => {
    userScrolledToBottom = isAtBottom();

    if (userScrolledToBottom) {
        newMessageNotification.style.display = 'none';
    }
});

window.addEventListener('load', initChat);
messageInput.addEventListener('input', () => {
    updateCharCount();
    autoResizeTextarea(messageInput);
});
sendButton.addEventListener('click', sendMessage);

scheduleNextFetch();
