module.exports = {
  achievementAttachments
}

function achievementAttachments(achievement) {
  let message = `:sports_medal:${achievemnt.name}::\n*${quest.name}*\n${quest.description}\n\n:trophy: Reward: ${quest.xp} xp :trophy:`

  return [{
            text: `${message}`,
            fallback: "You are unable to accept the quest",
            callback_id: "new_quest",
            color: "#3AA3E3",
            attachment_type: "default",
            actions: [
              {
              name: "accept",
              style: "primary",
              text: "Accept",
              type: "button",
              value: `${questId}`
              }, 
              {
                name: "ignore",
                style: "danger",
                text: "Ignore",
                type: "button",
                value: `${questId}`
              }
        ]
    }]
}
}