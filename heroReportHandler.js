module.exports = {
    heroReportAnswer
}

var database = require("./database")
var questParticipation = require("./questParticipation")

function levelThroshold(lv) {
    return questPrticipation.xpLevels((element) => {
        return xp < element
    }) +1
}

function heroReportAnswer(req, res, callback){
    let userId = req.body.user_id
    var max = levelThroshold(user.level)
    database.getUser(userId, (user) => {
      var responceMessage = `:space_invader: ${user.roleId}: ${user.name} \
      \n:trophy: Level: ${user.level}\n:star2: Exp.: ${user.xp} / ${max}`
      callback (responceMessage)
  })

}
