const id = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, e => (e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16));
let interval;
let showMessageFunc = () => null;
let sentMessageCounter = 0;

const sendMessage = (text, userName) => {
    showMessageFunc({content: text, user: userName, id: id(), timestamp: Date.now()});
};
const intervalFunc = () => {
    if (sentMessageCounter >= 3) {
        clearInterval(interval);
    } else {
        sendMessage(faker.hacker.phrase(), faker.name.firstName());
        sentMessageCounter++;
    }
};
const startInterval = () => {
    sentMessageCounter = 0;
    clearInterval(interval);
    interval = setInterval(intervalFunc, 5e3);
};
startInterval();





window.Chat = {
    sendMessage(text, user) {
        startInterval();
        sendMessage(text, user);
    },
    onMessage(func) {
        startInterval();
        showMessageFunc = func;
    }
};
