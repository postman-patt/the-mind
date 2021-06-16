const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { userJoin, getSessionIDUsers, userLeave } = require('./utils/users.js')
const {
  checkSession,
  initGameState,
  deal,
  joinSession,
  playCard,
  checkGameOver,
  checkGameWon,
  playerLeft,
} = require('./utils/gameLogic.js')

//Setting CORS access list
const socketio = require('socket.io')
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

const PORT = 5000 || process.env.PORT

//Socket
io.on('connection', (socket) => {
  socket.on('checkIfSessionExists', (sessionID) => {
    const checkSessionID = checkSession(sessionID)
    if (checkSessionID) {
      //If game doesnt exists
      socket.emit('serverReply', false)
    } else {
      //If game does exists
      socket.emit('serverReply', true)
    }
  })

  //Join room
  socket.on('joinRoom', ({ username, sessionID }) => {
    const user = userJoin(socket.id, username, sessionID)

    //Join the room/session
    socket.join(sessionID)

    const checkSessionID = checkSession(sessionID)

    if (checkSessionID) {
      //If game doesnt exists
      //Init game state
      const gameState = initGameState(sessionID, getSessionIDUsers(sessionID))
      //Sent the initial game state to the users
      io.to(user.sessionID).emit('initGameState', {
        gameState,
        player: socket.id,
      })
    } else {
      //If game exists
      //Retrieve current game state
      const currentGameState = joinSession(sessionID, user)

      io.to(user.id).emit('setPlayerId', user.id)

      io.to(user.sessionID).emit('updateGameState', currentGameState)
    }

    //Deal cards
    socket.on('dealCards', (sessionID) => {
      io.to(user.sessionID).emit('updateGameState', deal(sessionID))
    })

    //Play card
    socket.on('playCard', ({ sessionID, value, player }) => {
      io.to(user.sessionID).emit(
        'updateGameState',
        playCard(sessionID, value, player)
      )
    })

    //Check game over
    socket.on('checkGameOver', (sessionID) => {
      io.to(user.sessionID).emit('updateGameState', checkGameOver(sessionID))
    })

    //Check game won
    socket.on('checkGameWon', (sessionID) => {
      io.to(user.sessionID).emit('updateGameState', checkGameWon(sessionID))
    })

    //update game state
    socket.on('updateGameState', (gameState) => {
      socket.to(user.sessionID).emit('updateGameState', gameState)
    })
  })

  //On disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user)
      io.to(user.sessionID).emit(
        'updateGameState',
        playerLeft(user.sessionID, user.id)
      )
  })
})

server.listen(PORT, () => {
  console.log(`Sever is running on port: ${PORT}`)
})
