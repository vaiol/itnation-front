const { v4: uuid } = require('uuid');

class MessageHistoryService {
    constructor() {
        this.history = [];
    }

    addMessage(authorId, messageText) {
        const text = messageText.trim();
        const messageItem = { id: uuid(), date: new Date(), authorId, text };
        this.history.unshift(messageItem);
        return messageItem;
    }

    getLastMessages(limit, fromDate) {
        if (!limit) {
            limit = 100;
        }
        if (this.history.length < limit) {
            return this.history;
        }
        if (!fromDate) {
            return this.history.slice(0, limit);
        }
        let i = 0;
        let currentMessage = this.history[i];
        while (i < this.history.length && fromDate <= currentMessage.date && i < limit) {
            i += 1;
            currentMessage = this.history[i];
        }
        return this.history.slice(0, i);
    }
}

module.exports = {
    MessageHistoryService
};
