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
