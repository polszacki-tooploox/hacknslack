module.exports = {
    parseQuest: function(questMessage) {
        parseQuestMessage(questMessage)
    }

    parseMessage: function(message) {
        parse(message)
    }
};

Actions = {
    addQuest,
    other
}

// Return me
function parseQuestMessage(questMessage) {

  // TODO: Wymyslic interfejs
  let name = questMessage // parse
  let description = questMessage // parse
  let xp = questMessage // parse

  return name, description, xp
}

function parse(message) {

  return (user, addQuest)
}
