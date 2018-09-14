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
var dataFetcher = require('./dataFetcher');
var database = require('./database')
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
database.init()

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(4212, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});


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

// The port we'll be using for our Express server
const PORT = 3000;

// The channel we'll send TalkBot messages to
const channel = '#krecina_test'

// Slack events client
app.use('/events', slackEvents.expressMiddleware());

slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
    handleEvent(event)
});

slackEvents.on('app_mention', (event) => {
    console.log(`Received a mention event: user ${event.user} in channel ${event.channel} says ${event.text}`);
    handleEvent(event)
});

function handleEvent(event) {
  Console.log(event)
}
