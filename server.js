// server.js
// where your node app starts

var eventType = {
  levelUp: "levelUp",
  questMade: "questMade",
  questCreated: "questCreated"
}

// init project
var express = require('express');
var bodyParser = require('body-parser');
var database = require('./database')
var addQuestRequestHandler = require('./addQuestRequestHandler')
var heroReportHandler = require('./heroReportHandler')
var questConstructor = require('./questConstructor')
var participateInQuest = require('./questParticipation').participateInQuest
var ignoreQuest = require('./questParticipation').ignoreQuest
var checkQuestStatus = require('./questParticipation').checkQuestStatus
var events = require('./events')
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

app.get("/bot_events", (request, res) => {
  events.createEventsResponse((eventsJSON) => {
    console.log("WYSYLAM")
    res.send(eventsJSON);
  })
})

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
                  handleQuestInteraction(payload, res)
                  break
            }
            break
        case 'dialog_submission':
            var data = payload.submission
            // If not given, there is no limit
            let parsedLimit = parseInt(data.heroesLimit)
            let usersLimit = data.heroesLimit == null || isNaN(parsedLimit) ? 999 : parsedLimit
            let quest = {
                description: data.description,
                xp: data.exp,
                name: data.name,
                usersLimit: usersLimit,
                messageTimestamp: ""
            }
            database.upsertQuest(quest, (newQuestId) => {
                database.getQuest(newQuestId, (quest) => {
                    var message = questConstructor.questMessage(quest)
                    var attachment = questConstructor.questAttachments(message, newQuestId)
                    res.send('')
                    console.log(eventType.questCreated)
                    var eventJson = events.eventCreator({
                        type: eventType.questCreated,
                        associatedData: {newQuestId}
                    }, {}, {questId: newQuestId})
                    console.log(eventJson)
                    database.insertEvent(JSON.stringify(eventJson))
                    sendMessage("hacknslack", attachment, (ts) => {
                      quest.messageTimestamp = ts
                      database.upsertQuest(quest, ()=>{})
                    })
                })
            })
            break
    }
})

function handleQuestInteraction(payload, res) {
  var questId = payload.actions[0].value
  var didAccept = payload.actions[0].name == "accept"
  if (didAccept) {
      handleQuestAcceptance(payload.user.id, questId)
  } else {
      handleQuestIgnore(payload.user.id, questId)
  }

  updateQuestMessage(payload, questId)
  res.send('')
}

function updateQuestMessage(payload, questId) {
  database.getQuest(questId, (quest) => {
      database.getQuestUsers(questId, (userIds) => {
        
        checkQuestStatus(questId, (isFull, isEmpty) => {
          var message = questConstructor.questMessage(quest)
          var attachment = new Object()
          if(isFull) {
            attachment = questConstructor.questAttachmentsLimitsReached(message, userIds, questId)
          } else if(isEmpty) {
            attachment = questConstructor.questAttachments(message, questId)
          } else {
            attachment = questConstructor.questAttachmentsAccepted(message, userIds, questId)
          }
          
          updateMessage(payload.channel.id, attachment, payload.message_ts)
        })
      })
  })
}

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
  if(event.text == "Alarm to ja") {
    showAlarmAchievement(event.user, event.channel)
  }
});

slackEvents.on('reaction_added', (event) => {
    console.log(`Reaction added: user ${event.user} in channel ${event.item.channel} reaction: ${event.reaction}`);
});

function sendMessage(channel, attachment, callback) {

    // Send message using Slack Web Client
  
    bot.chat.postMessage(
      { 
        channel: channel,
        attachments: attachment,
        as_user: false
      })
    .then((res) => {
    // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
      callback(res.ts)
    })
    .catch(console.error); 
}

function sendMessageWithoutAttachment(channel, message, userId) {

    // Send message using Slack Web Client
    bot.chat.postEphemeral({
            text: message,
            channel: channel,
            user: userId,
            as_user: false
        }, (data) => {
            console.log(data)
        })
}

function sendEphermalMessage(channel, attachment) {

    // Send message using Slack Web Client
    bot.chat.postEphemeral({
        attachments: attachment,
            channel: channel,
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


function showAlarmAchievement(user, channel) {
  
}