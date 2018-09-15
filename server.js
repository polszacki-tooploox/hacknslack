// server.js
// where your node app starts
let betKey = "bet"
let matchesKey = "matches"
let todayKey = "today"
let topKey = "top"
let couponsKey = "coupons"
let helpKey = "help"
let maxPoints = 8
let minPoints = 3


// init project
var express = require('express');
var bodyParser = require('body-parser');
var database = require('./database')
var addQuestRequestHandler = require('./addQuestRequestHandler')
var heroReportHandler = require('./heroReportHandler')
var questConstructor = require('./questConstructor')
var participateInQuest = require('./questParticipation').participateInQuest
var ignoreQuest = require('./questParticipation').ignoreQuest
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
database.initDatabase()

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.post('/quest', (req, res) => {
  addQuestRequestHandler.handleRequest(req, res)
});

app.post('/check_hero', (req, res) => {
    heroReportHandler.heroReportAnswer(req, res, (response) => {
        sendMessageWithoutAttachment("hacknslack", response, req.body.user_id)
    })
  });

// listen for requests :)
var listener = app.listen(4212, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});

// hadnling buttons
app.post('/', (req, res) => {
    var payload = JSON.parse(req.body.payload)
    switch (payload.type) {
        case 'interactive_message':
            switch (payload.callback_id) {
                case 'new_quest':
                    var questId = payload.actions[0].value
                    var didAccept = payload.actions[0].name == "accept"
                    if (didAccept) {
                        handleQuestAcceptance(payload.user.id, questId)
                    } else {
                        handleQuestIgnore(payload.user.id, questId)
                    }
                    database.getQuest(questId, (quest) => {
                        database.getQuestUsers(questId, (userIds) => {
                            var message = questConstructor.questMessage(quest)
                            var attachment = questConstructor.questAttachmentsAccepted(message, userIds, questId)
                            res.send('')
                            updateMessage(payload.channel.id, attachment, payload.message_ts)
                        })
                    })
            }
            break
        case 'dialog_submission':
            var data = payload.submission
            let quest = {
                description: data.description,
                xp: data.exp,
                name: data.name,
                usersLimit: data.heroesLimit
            }
            database.upsertQuest(quest, (newQuestId) => {
                database.getQuest(newQuestId, (quest) => {
                    var message = questConstructor.questMessage(quest)
                    var attachment = questConstructor.questAttachments(message, newQuestId)
                    res.send('')
                    sendMessage("hacknslack", attachment)
                })
            })
            break
    }
})

function handleQuestAcceptance(userId, questId) {
    participateInQuest(userId, questId)
}

function handleQuestIgnore(userId, questId) {
    ignoreQuest(userId, questId)
}

// request to self to wake up
var request = require("request")
app.listen(8080);
setInterval(() => {
    request({
        url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/`,
        method: "GET"
    });
}, 280000);



require('dotenv').config();

const WebClient = require('@slack/client').WebClient;
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;

// Retrieve bot token from dotenv file
const bot_token = process.env.SLACK_BOT_TOKEN || '';
// Authorization token
const auth_token = process.env.SLACK_AUTH_TOKEN || '';
// Verification token for Events Adapter
const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);

// Slack web client
const web = new WebClient(auth_token);
const bot = new WebClient(bot_token);
let users = bot.users.list().then((users) => {
    database.loadUsersToDatabase(users.members)
})

// Slack events client
app.use('/events', slackEvents.expressMiddleware());

slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

slackEvents.on('app_mention', (event) => {
    console.log(`Received a mention event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

// This function is discussed in "Responding to actions" below
function handlerFunction() {
  Console.log("Received action")
}

function sendMessage(channel, attachment) {

    // Send message using Slack Web Client
    console.log(attachment)
    console.log(channel)
    bot.chat.postMessage({
            channel: channel,
            attachments: attachment,
            as_user: false
        }, (data) => {
            console.log(data)
        })
}

function sendMessageWithoutAttachment(channel, message, userId) {

    // Send message using Slack Web Client
    console.log(channel)
    bot.chat.postEphemeral({
            text: message,
            channel: channel,
            user: userId,
            as_user: false
        }, (data) => {
            console.log(data)
        })
}

function updateMessage(channel, attachment, timestamp) {
    bot.chat.update({
        channel: channel,
        attachments: attachment,
        ts: timestamp
    })
}   
