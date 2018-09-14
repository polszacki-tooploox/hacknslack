module.exports = {
  questMessage,
  questAttachments,
  questAttachmentsAccepted
};

function questMessage(quest) {
  var quest = quest[0]
  return `:grey_exclamation:New quest :grey_exclamation:\n${quest.name}\n${quest.description}\n\n:trophy: Reward: ${quest.xp} xp :trophy:`
}

function questAttachments(message, questId) {
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


function questAttachmentsAccepted(message, userIds, questId) {
  let users = userIds.map( (userId) => {
    return `<@${userId.userId}>, `
  })
  let acceptedMessage = `\n ${users} accepted the quest! Good luck on your adventure!`

  return [{
            text: `${message}` + acceptedMessage,
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
