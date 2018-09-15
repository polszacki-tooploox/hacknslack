module.exports = {
    heroReportAnswer
}

var database = require("./database")
var xpLevels = require("./questParticipation").xpLevels()

function heroReportAnswer(req, res, callback){
    let userId = req.body.user_id
    
    database.getUser(userId, (user) => {
        var max = xpLevels[user.level-1]
        var responceMessage = `:alien: ${user.roleId}: ${user.name} \
        \n:trophy: Level: ${user.level}\n:star2: Exp.: ${user.xp} / ${max}`  
      callback (responceMessage)
  })
}
