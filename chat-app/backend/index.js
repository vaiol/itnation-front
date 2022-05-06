const express = require('express');
const cors = require('cors');

const {MessageHistoryService} = require("./message-history.service");
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

const messagesService = new MessageHistoryService();

app.get('/message', (req, res) => {
    const { fromDate: fromDateStr, limit: limitStr } = req.query;
    let limit;
    let fromDate;
    if (limitStr) {
        limit = parseInt(limitStr, 10);
        if (isNaN(limit)) {
            res.status(400);
            return res.send(`Bad Request: wrong 'limit' query param.`);
        }
    }
    if (fromDateStr) {
        fromDate = new Date(fromDateStr);
        if (isNaN(fromDate.getTime())) {
            res.status(400);
            return res.send(`Bad Request: wrong 'fromDate' query param.`);
        }
    }
    res.send({
        returnDate: new Date(),
        data: messagesService.getLastMessages(limit, fromDate)
    });
});

app.post('/message', (req, res) => {
    const { authorId, text } = req.body;
    if (!authorId || !text) {
        res.status(400);
        return res.send(`Bad Request: wrong body params 'authorId' or 'body'`);
    }
    messagesService.addMessage(authorId, text);
    res.send({
        returnDate: new Date(),
        data: messagesService.getLastMessages()
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});