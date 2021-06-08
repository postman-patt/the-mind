const users = []

function userJoin(id, name, room, inGame) {
  const user = { id, name, room, cards: [], inGame }
  users.push(user)
  return user
}

//Get current player
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

//User leaves room
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index)[0]
  }
}

//Get players in the room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room)
}

module.exports = { userLeave, getRoomUsers, userJoin, getCurrentUser }
