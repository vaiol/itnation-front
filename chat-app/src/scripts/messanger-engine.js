/**
 * Constants
 */
const DEFAULT_USERNAME_COLOR = 'black';
const MY_USERNAME = localStorage.getItem('username') || "User" + Math.floor(Math.random() * 10000);
if (!localStorage.getItem('username')) {
    localStorage.setItem('username', MY_USERNAME);
}

/**
 * Helpers
 */
const generateTimeFromTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.substr(-2);
};

const generateColorFromUsername = (user) => {
    const USERNAME_COLORS = ['#F44336', '#E91E63', '#3F51B5', '#009688', '#4CAF50', '#FF9800', '#FF5722', '#795548', '#8BC34A'];
    let hash = 0;
    let i;
    let chr;
    for (i = 0; i < user.length; i++) {
        chr   = user.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return USERNAME_COLORS[Math.abs(hash) % USERNAME_COLORS.length];
};

// -- onMessage
const messagesRootElement = document.getElementById("messages-root");



/*
<div class="message with-arrow">
      <div class="message-name" style="color: red">
        User1
      </div>
      <span>
        Message text 1
      </span>
      <div class="message-time">
        16:30
      </div>
    </div>
 */
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
    window.Chat.sendMessage(messageText, MY_USERNAME);
    messageInputElement.value = "";
});


