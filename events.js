module.exports = {
    eventType,
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
  database.getEvents((events) => {
    events.map((event) => {
      console.log(event)
        var json = JSON.parse(event.data)
        console.log(json)
        database.getUser(json.userId, (user => {
          database.getQuest(json.questId, (quest) => {
            database.getQuestUsers(json.questId, (users) => {
                if (counter == events.lenght) {
                  c
                  callback(buildResponse(event, user, quest, users))
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
  console.log(quest)
  var response = {
    type: event.type,
    message: event.message
  }
  if (user) {
    response.user = user
  }
  if(quest) {
    if(questUsers) {
      quest.questUsers = questUsers
    }
    response.quest = quest
  }
  return response
}