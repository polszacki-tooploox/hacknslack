module.exports = {
    participateInQuest,
    ignoreQuest,
    xpLevels: () => { return xpLevels },
    checkQuestStatus
};

var database = require("./database")
var Events = require("./events")
var eventType = require("./events").eventType()
var xpLevels = [
  10,
  30,
  60,
  100,
  150,
  220,
  300,
  9999999
]

function checkQuestStatus(questId, callback) {
  
  database.getQuestUsers(questId, (questUserIds) => {
    database.getQuest(questId, (quest) => {
        if (quest[0].usersLimit == questUserIds.length) {
          callback(true, false)
        } else if (questUserIds.length == 0 || questUserIds == null) {
          callback(false, true)
        } else {
          callback(false, false)
        }
     })
  })
}

function participateInQuest(userId, questId) {

    checkIfUserIsParticipating(userId, questId, (isParticipating) => {
      
      if (isParticipating) {
        return
      }
      
      database.assignUserToQuest(userId, questId)
      database.getUser(userId, (user) => {
        database.getQuest(questId, (quest) => {
            updateXP(user, quest[0].xp)
        })
      })
    })
}

function ignoreQuest(userId, questId) {
  
      checkIfUserIsParticipating(userId, questId, (isParticipating) => {
      
        if (!isParticipating) {
          return
        }
        
        database.unassignUserFromQuest(userId, questId)
        database.getUser(userId, (user) => {
          database.getQuest(questId, (quest) => {
            updateXP(user, -quest[0].xp)
          })
        })
      })
}

function updateXP(user, xp) {
  var currentXP = user.xp
  if (currentXP == null) {
      currentXP = 0
  }
  var previousLevel = user.level
  var currentLevel = calculateLevel(currentXP)
  database.updateUserXPAndLevel(user.id, currentXP + xp, currentLevel)
  if (previousLevel < currentLevel) {
      userDidLevelUp(user.id, currentLevel)
  }
}

function checkIfUserIsParticipating(userId, questId, callback) {

    database.getQuestUsers(questId, (questUserIds) => {
      
      let userIds =  questUserIds.map( (userId) => {
        return userId.userId
      })
    
      if (userIds.includes(userId)) {
        callback(true)
      } else {
        callback(false)
      }
    })
}

function calculateLevel(xp) {
    return xpLevels.findIndex((element) => {
        return xp < element
    }) +1
}

function userDidLevelUp(userId, level) {
    var eventJson = Events.eventCreator({
        type: eventType.levelUp,
        associatedData: level
    }, {userId})
    database.insertEvent(JSON.stringify(eventJson))
}

