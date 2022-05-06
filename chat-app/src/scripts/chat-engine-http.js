const shownMessages = new Set();
let lastUpdatedDate;

const url = 'http://localhost:3000/message';

let showMessageFunc;

const showMessages = (result) => {
    lastUpdatedDate = new Date(result.returnDate);
    for (const message of result.data.reverse()) {
        if (!shownMessages.has(message.id)) {
            shownMessages.add(message.id);
            showMessageFunc({ content: message.text, user: message.authorId, timestamp: message.date })
        }
    }
};

const uploadData = () => {
    let finalUrl = lastUpdatedDate ? `${url}?fromDate=${lastUpdatedDate.toISOString()}` : url;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", finalUrl, false );
    xmlHttp.send( null );
    const result = JSON.parse(xmlHttp.responseText);
    showMessages(result);
};

const sendHttpPostMessage = (text, authorId) => {
    const body = {
        authorId,
        text,
    };
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", url, false );
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify(body));
    const result = JSON.parse(xmlHttp.responseText);
    showMessages(result);
};

setInterval(uploadData, 1000);




window.Chat = {
    sendMessage(text, author) {
        sendHttpPostMessage(text, author);
    },
    onMessage(e) {
        showMessageFunc = e;
    },
};
