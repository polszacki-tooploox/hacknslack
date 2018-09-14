module.exports = {
    heroReportAnswer(userId, callback){
        heroReportAnswer(userId, callback)
    }
};

var database = require("./database")

function heroReportResponce(userId, callback){
  database.getUser(UserId, (user) => {
      var responceMessage = `:space_invader: Hero: ${user.fullName} \
      (${user.roleID})\n:muscle: Level: ${user.level}\n:coin: Exp.: ${user.xp}`
      callback (responceMessage)
  })

}
