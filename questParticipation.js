module.exports = {
    participateInQuest
};

var database = require("./database")

function participateInQuest(userId, questId) {
    database.assignUserToQuest(userId, questId)
    database.getUser(userId, (user) => {
        database.getQuest(questId, (quest) => {
            var currentXP = user.xp
            var currentLevel = user.level
            database.updateUserXPAndLevel(currentXP + quest.xp, currentLevel)
        })
    })
}

