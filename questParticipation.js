module.exports = {
    participateInQuest,
    ignoreQuest,
    checkIfQuestIsFull
};

var database = require("./database")

function checkIfQuestIsFull(questId, callback) {
  
  database.getQuestUsers(questId, (questUserIds) => {
    database.getQuest(questId, (quest) => {
        if (quest.usersLimit == questUserIds.length) {
          callback(true)
        } else {
          callback(false)
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
  
      checkIfUserIsParticipating(userId, questId, (isParticipating) => {
      
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
    var xpLevels = [
        1000,
        3000,
        5000,
        10000,
        20000
    ]
    return xpLevels.findIndex((element) => {
        return xp < element
    })
}

