module.exports = {
    participateInQuest
};

var database = require("./database")

function participateInQuest(userId, questId) {
    
    database.getQuestUsers(questId, (dbUserId) => {

      if (dbUserId.includes(userId)) {
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

