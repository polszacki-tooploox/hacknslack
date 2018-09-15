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
        message: `Joined quest`
      }
  }
}

function createEventsResponse(callback) {
  database.getEvents((events) => {
    events.map((event) => {
        var json = JSON.parse(event.data)
        database.getUser(json.userId, (user => {
          database.getQuest(json.questId, (quest) => {
            database.getQuestUsers(json.questId, (users) => {
                callback(buildResponse(event, user, quest, users))
            })
          })
        }))
    })
  })
}

function buildResponse(event, user, quest, questUsers) {
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