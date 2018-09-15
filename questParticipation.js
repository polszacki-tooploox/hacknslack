module.exports = {
    participateInQuest,
    ignoreQuest,
    xpLevels
};

var database = require("./database")
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

function participateInQuest(userId, questId) {

    isUserParticipating(userId, questId, (isParticipating) => {
      
      if (isParticipating) {
        return
      }
      
      database.assignUserToQuest(userId, questId)
      database.getUser(userId, (user) => {
        database.getQuest(questId, (quest) => {
            var currentXP = user.xp
            if (currentXP == null) {
                currentXP = 0
            }
            var currentLevel = calculateLevel(currentXP)
            database.updateUserXPAndLevel(userId, currentXP + quest[0].xp, currentLevel)
        })
      })
    })
}

function ignoreQuest(userId, questId) {
  
      isUserParticipating(userId, questId, (isParticipating) => {
      
        if (!isParticipating) {
          return
        }
        
        database.unassignUserFromQuest(userId, questId)
        database.getUser(userId, (user) => {
          database.getQuest(questId, (quest) => {
            var currentXP = user.xp
            if (currentXP == null) {
                currentXP = 0
            }
            var currentLevel = calculateLevel(currentXP)
            database.updateUserXPAndLevel(userId, currentXP - quest[0].xp, currentLevel)
          })
        })
      
      })
}

function isUserParticipating(userId, questId, callback) {

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

