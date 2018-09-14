module.exports = {
  questMessage(quest) {
    questMessage(quest)
  },
  buttonAttachments() {
    buttonAttachments()
  }
};

function questMessage(quest) {
  return `:grey_exclamation:New quest :grey_exclamation:\n${quest.name}\n${quest.description}\n\n:trophy: Reward: ${quest.xp} xp :trophy:`
}

function questAttachments(message) {
  return `\
        [{ \
            \"text\": \"${message}\", \
            \"fallback\": \"You are unable to choose a game\", \
            \"callback_id\": \"wopr_game\", \
            \"color\": \"#3AA3E3\", \
            \"attachment_type\": \"default\", \
            \"actions\": [ \
                { \
                    \"name\": \"accept\", \
          \"style\": \"primary\", \
                    \"text\": \"Accept\", \
                    \"type\": \"button\", \
                    \"value\": \"accept\" \
                } \
      ] \
    }]`
}
