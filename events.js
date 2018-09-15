module.exports = {
    eventType,
    eventMetadata,
    eventCreator,
    createEventsResponse
}

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
        userId: userEventMetadata.userId,
        questId: null,
        message: `Gained new level`
      }
    case eventType.questMade:
      return {
        userId: userEventMetadata.userId,
        questId: questEventMetadata.questId,
        message: `Joined quest`
      }
    case eventType.questCreated:
      return {
        userId: null,
        questId: questEventMetadata.questId,
        message: `Joined quest`
      }
  }
}

function createEventsResponse(database) {
  database.getEvents((events) => {
    events.map((event) => {
      
    })
  })
}