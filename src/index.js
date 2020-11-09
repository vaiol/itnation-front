import './style.css';
// -- constants
const DEFAULT_USERNAME_COLOR = 'black';
const USERNAME_COLORS = ['red', 'green', 'blue', 'brown', 'purple', 'cyan', 'coral', 'DarkSeaGreen', 'ForestGreen'];
const MY_USERNAME = "Me";
const ONE_TYPING_USER_TEXT = 'is writing...';
const MANY_TYPING_USERS_TEXT = 'are writing...';

// -- onMessage
const messagesRootElement = document.getElementById("messages-root");

const generateNewMessageBlockElement = (text, username, time, { isSelfMessage, isFirstMessage, usernameColor }) => {
    const messageBlock = document.createElement('div');
    messageBlock.className = "message";
    if (isSelfMessage) {
        messageBlock.classList.add("self");
    }
    if (isFirstMessage) {
        messageBlock.classList.add("with-arrow");
    }
    if (username && !isSelfMessage) {
        const messageNameBlock = document.createElement('div');
        messageNameBlock.className = "message-name";
        messageNameBlock.style.color = usernameColor || DEFAULT_USERNAME_COLOR;
        messageNameBlock.innerText = username;
        messageBlock.appendChild(messageNameBlock);
    }
    const spanContentEl = document.createElement('span');
    spanContentEl.innerText = text;
    messageBlock.appendChild(spanContentEl);
    if (time) {
        const messageTimeBlock = document.createElement('div');
        messageTimeBlock.className = "message-time";
        messageTimeBlock.innerText = time;
        messageBlock.appendChild(messageTimeBlock);
    }
    return messageBlock;
};

const generateTimeFromTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.substr(-2);
};

const generateColorFromUsername = (timestamp) => {
    let hash = 0;
    let i;
    let chr;
    for (i = 0; i < timestamp.length; i++) {
        chr   = timestamp.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return USERNAME_COLORS[Math.abs(hash) % USERNAME_COLORS.length];
};

let lastUserMessage = null;

const onMessageHandler = ({ content, user, timestamp }) => {
    const options = { isFirstMessage: false, isSelfMessage: false };
    if (user !== lastUserMessage) {
        options.isFirstMessage = true;
    }
    if (user === MY_USERNAME) {
        options.isSelfMessage = true;
    } else {
        options.usernameColor = generateColorFromUsername(user);
    }
    lastUserMessage = user;
    const time = generateTimeFromTimeStamp(timestamp);
    const newMessageBlockElement = generateNewMessageBlockElement(content, user, time, options);
    messagesRootElement.appendChild(newMessageBlockElement);
    window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
};

window.Chat.onMessage(onMessageHandler);


// -- onTyping

const typingRootElement = document.getElementById("typing-root");

const whoIsTypingNow = new Set();

const updateTypingUI = () => {
    if (whoIsTypingNow.size === 0) {
        typingRootElement.style.display = 'none';
        return;
    }
    typingRootElement.style.display = 'block';
    const typingList = [...whoIsTypingNow].join(', ');
    if (whoIsTypingNow.size === 1) {
        typingRootElement.innerText = `${typingList} ${ONE_TYPING_USER_TEXT}`;
    } else {
        typingRootElement.innerText = `${typingList} ${MANY_TYPING_USERS_TEXT}`;
    }
};
const removeTypingUsername = (username) => {
    whoIsTypingNow.delete(username);
    updateTypingUI();
};
const addTypingUsername = (username) => {
    if (username === MY_USERNAME) {
        return;
    }
    whoIsTypingNow.add(username);
    updateTypingUI();
};

const onTypingHandler = (username) => {
    addTypingUsername(username);
    setTimeout(() => removeTypingUsername(username), 8000);
};

window.Chat.onTyping(onTypingHandler);


// sendMessage

const messageInputElement = document.getElementById("message-input");
const controlsSendBtnElement = document.getElementById("controls-send-btn");

controlsSendBtnElement.addEventListener('click', () => {
    const text = messageInputElement.value;
    if (!text || text.length === 0) {
        return;
    }
    const messageText = text.trim();
    if (messageText.length === 0) {
        messageInputElement.value = "";
        return;
    }
    window.Chat.sendMessage(messageText);
    messageInputElement.value = "";
});


