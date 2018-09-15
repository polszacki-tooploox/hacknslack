module.exports = {
    participateInQuest,
    ignoreQuest,
    checkQuestStatus,
    addXpForEmote
};

var database = require("./database")

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
  var currentLevel = calculateLevel(currentXP)
  database.updateUserXPAndLevel(user.id, currentXP + xp, currentLevel)
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

function addXpForReaction(userId, reaction) {
  if (reaction == "coin") {
    updateXP(user, 1)
  }
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

