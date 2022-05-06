const shownMessages = new Set();

const createId = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, e => (e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16));
let showMessageFunc = () => null;

const sendMessage = (text, userName) => {
    const id = createId();
    shownMessages.add(id);
    const messageItem = {content: text, user: userName, id, timestamp: new Date()};
    showMessageFunc(messageItem);
    const messages = JSON.parse(localStorage.getItem('messages'));
    messages.push(messageItem);
    localStorage.setItem('messages', JSON.stringify(messages));
};

const showMessages = () => {
    const messages = JSON.parse(localStorage.getItem('messages'));
    for (const message of messages) {
        if (!shownMessages.has(message.id)) {
            shownMessages.add(message.id);
            showMessageFunc({ content: message.content, user: message.user, timestamp: message.timestamp });
        }
    }
};
if (!localStorage.getItem('messages')) {
    localStorage.setItem('messages', JSON.stringify([]));
}

setInterval(showMessages, 500);




window.Chat = {
    sendMessage(text, user) {
        sendMessage(text, user);
    },
    onMessage(e) {
        showMessageFunc = e;
    }
};
