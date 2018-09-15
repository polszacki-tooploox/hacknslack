module.exports = {
    eventType: () => { return eventType },
    eventMetadata,
    eventCreator,
    createEventsResponse
}

var database = require("./database")

var eventType = {
  levelUp: "levelUp",
  questMade: "questMade",
  questCreated: "questCreated"
}

var eventMetadata = {
  type: "",
  associatedData: ""
}

function eventCreator(eventMetadata, userEventMetadata, questEventMetadata) {
  switch (eventMetadata.type) {
    case eventType.levelUp:
      return {
        type: eventMetadata.type,
        userId: userEventMetadata.userId,
        questId: null,
        message: `Gained new level ${eventMetadata.associatedData}`
      }
    case eventType.questMade:
      return {
        type: eventMetadata.type,
        userId: userEventMetadata.userId,
        questId: questEventMetadata.questId,
        message: `Joined quest`
      }
    case eventType.questCreated:
      return {
        type: eventMetadata.type,
        userId: null,
        questId: questEventMetadata.questId,
        message: `Created quest`
      }
  }
}

function createEventsResponse(callback) {
  var counter = 1
  var eventsArray = []
  database.getEvents((events) => {
    events.map((event) => {
        var json = JSON.parse(JSON.parse(event.data))
        database.getUser(json.userId, (user => {
          database.getQuest(json.questId, (quest) => {
            database.getQuestUsers(json.questId, (users) => {
                
                eventsArray.push(buildResponse(json, user, quest, users))
                if (counter == events.length) {
                  callback(eventsArray)
                } else {
                  counter++
                }
            })
          })
        }))
    })
  })
}

function buildResponse(event, user, quest, questUsers) {
  console.log(event)
  console.log(event["type"])
  var response = {
    type: event["type"],
    message: event["message"]
  }
  console.log(response)
  if (user) {
    response.user = user[0]
  }
  if(quest) {
    var evetnQuest = quest[0]
    if(questUsers && evetnQuest) {
      evetnQuest.questUsers = questUsers
    }
    response.quest = evetnQuest
  }
  return response
}