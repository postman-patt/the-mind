const users = []

function userJoin(id, name, sessionID) {
  const user = { id, name, sessionID, cards: [] }
  users.push(user)
  return user
}

//Get current player
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

//User leaves sessionID
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index)[0]
  }
}

//Get players in the sessionID
function getSessionIDUsers(sessionID) {
  return users.filter((user) => user.sessionID === sessionID)
}

module.exports = { userLeave, getSessionIDUsers, userJoin, getCurrentUser }
