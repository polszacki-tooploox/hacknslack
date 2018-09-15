module.exports = {
  achievementAttachments
}

function achievementAttachments(achievement) {

  return [{
            fallback: "You are unable to accept the quest",
            color: "#36a64f",    
            title: `:sports_medal:${achievement.name}:sports_medal:`,
            text: `${achievement.description}`,
            thumb_url: `${achievement.icon}`
    }]
}

function spaceInvaderAchievement() {
  let achievement = {
    name: "Space Invader",
    description: "You earned the Achievement “Space Invader” for completing quest “Space Hoopla” Let’s conquer the universe!",
    icon: "https://image.flaticon.com/icons/png/512/280/280761.png"
  }
  return achievement
}

function alarmAchievement() {
  let achievement = {
    name: "Not A Ninja",
    description: "You earned the Achievement “Not A Ninja” for activating the alarm. Let’s conquer the universe!",
    icon: "http://www.myiconfinder.com/uploads/iconsets/256-256-d126274718a0e884768ab345d31b53c0-alert.png"
  }
  return achievement
}
