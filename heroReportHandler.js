module.exports = {
    heroReportAnswer
}

var database = require("./database")

function heroReportAnswer(req, res, callback){


    let userId = req.body.userId
  database.getUser(userId, (user) => {
      var responceMessage = `:space_invader: Hero: ${user.fullName} \
      (${user.roleID})\n:muscle: Level: ${user.level}\n:coin: Exp.: ${user.xp}`
      callback (responceMessage)
  })

}
