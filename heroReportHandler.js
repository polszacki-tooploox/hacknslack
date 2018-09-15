module.exports = {
    heroReportAnswer
}

var database = require("./database")

function heroReportAnswer(req, res, callback){


    let userId = req.body.user_id
    database.getUser(userId, (user) => {
      var responceMessage = `:space_invader: Hero: ${user.name} \
      (${user.roleId})\n:muscle: Level: ${user.level}\n:coin: Exp.: ${user.xp}`
      callback (responceMessage)
  })
}
