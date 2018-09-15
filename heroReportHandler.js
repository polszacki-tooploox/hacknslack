module.exports = {
    heroReportAnswer
}

var database = require("./database")
var questParticipation = require("./questParticipation")

function heroReportAnswer(req, res, callback){
    let userId = req.body.user_id
    var max = questParticipation.xpLevels(user.level-1)
    database.getUser(userId, (user) => {
        var responceMessage = `:alien: ${user.roleId}: ${user.name} \
        \n:trophy: Level: ${user.level}\n:star2: Exp.: ${user.xp} / ${max}`  
      callback (responceMessage)
  })
}
