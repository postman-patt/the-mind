const sessions = []

//Generator cards to be dealt
const numberGenerator = () => {
  return Math.floor(Math.random() * 100 + 1)
}

//Check if session exists
const checkSession = (sessionID) => {
  if (sessions.every((item) => item.sessionID !== sessionID)) {
    return true
  } else {
    return false
  }
}

//Join user to room
const joinSession = (sessionID, player) => {
  const session = sessions.filter(
    (session) => session.sessionID === sessionID
  )[0]
  const updatedSession = {
    ...session,
    playerStates: [...session.playerStates, player],
  }

  //mutate state to include player
  const findIndex = sessions.findIndex(
    (session) => session.sessionID === sessionID
  )
  sessions.splice(findIndex, 1, updatedSession)

  //send the updated game state in the return
  return updatedSession
}

//Init initial game state
const initGameState = (room, players) => {
  const initialState = {
    sessionID: room,
    gameStart: false,
    gameOver: false,
    cardsPlayed: [],
    allCards: [],
    level: 1,
    levelComplete: false,
    playerStates: players,
  }
  sessions.push(initialState)

  return initialState
}

// Deal cards
const deal = (sessionID) => {
  const session = sessions.filter(
    (session) => session.sessionID === sessionID
  )[0]

  const players = session.playerStates.map((player) => ({
    ...player,
    cards: [],
  }))
  const allCardsDealt = []

  for (let i = 0; i < session.level; i++) {
    for (let j = 0; j < players.length; j++) {
      const dealCard = () => {
        let value = numberGenerator()
        let checkCard = allCardsDealt.every((card) => card !== value)
        if (checkCard) {
          players[j].cards.push(value)
          allCardsDealt.push(value)
        } else {
          dealCard()
          return
        }
      }
      dealCard()
    }
  }

  const updatedSession = {
    ...session,
    gameStart: true,
    gameOver: false,
    levelComplete: false,
    cardsPlayed: [],
    allCards: allCardsDealt,
    playerStates: players,
  }

  //mutate array
  const findIndex = sessions.findIndex(
    (session) => session.sessionID === sessionID
  )
  sessions.splice(findIndex, 1, updatedSession)

  return updatedSession
}

//Play card
const playCard = (sessionID, value, player) => {
  const session = sessions.filter(
    (session) => session.sessionID === sessionID
  )[0]

  const playerWithCard = session.playerStates.filter(
    (item) => item.id === player
  )[0]

  const updatedPlayerState = {
    ...playerWithCard,
    cards: playerWithCard.cards.filter((card) => card !== value),
  }

  const updatedCardsPlayed = [...session.cardsPlayed, value]
  const newPlayerStates = session.playerStates.map((item) =>
    item.id === updatedPlayerState.id ? updatedPlayerState : item
  )

  //Updated Session
  const updatedSession = {
    ...session,
    cardsPlayed: updatedCardsPlayed,
    playerStates: newPlayerStates,
  }

  //Mutate game state
  const findIndex = sessions.findIndex(
    (session) => session.sessionID === sessionID
  )
  sessions.splice(findIndex, 1, updatedSession)

  return updatedSession
}

//Check game over
const checkGameOver = (sessionID) => {
  const session = sessions.filter(
    (session) => session.sessionID === sessionID
  )[0]

  const sortedAllCards = session.allCards
    .sort((a, b) => a - b)
    .slice(0, session.cardsPlayed.length)
  if (sortedAllCards.toString() !== session.cardsPlayed.toString()) {
    //remove all cards from all players
    // const players = session.playerStates.map((player) => ({
    //   ...player,
    //   cards: [],
    // }))

    //Updated Session
    const updatedSession = {
      ...session,
      gameStart: false,
      gameOver: true,
    }

    //Mutate game state
    const findIndex = sessions.findIndex(
      (session) => session.sessionID === sessionID
    )
    sessions.splice(findIndex, 1, updatedSession)

    return updatedSession
  } else {
    return session
  }
}

//Check game won
const checkGameWon = (sessionID) => {
  const session = sessions.filter(
    (session) => session.sessionID === sessionID
  )[0]

  if (
    session.cardsPlayed.length >= 1 &&
    session.cardsPlayed.length === session.allCards.length
  ) {
    //remove all cards from all players
    const players = session.playerStates.map((player) => ({
      ...player,
      cards: [],
    }))

    //Updated Session
    const updatedSession = {
      ...session,
      gameStart: false,
      level: session.level + 1,
      levelComplete: true,
      playerStates: players,
    }

    //Mutate game state
    const findIndex = sessions.findIndex(
      (session) => session.sessionID === sessionID
    )
    sessions.splice(findIndex, 1, updatedSession)

    return updatedSession
  } else {
    return session
  }
}

//Player leaves

const playerLeft = (sessionID, playerLeftId) => {
  const session = sessions.filter(
    (session) => session.sessionID === sessionID
  )[0]

  const playerThatLeft = session.playerStates.filter(
    (player) => player.id === playerLeftId
  )[0]

  //Remove player from playerStates
  const newPlayerStates = session.playerStates.filter(
    (player) => player.id !== playerThatLeft.id
  )

  //Update cards played
  const newCardsPlayed = session.cardsPlayed.filter((cardPlayed) =>
    playerThatLeft.cards.every(
      (playerThatLeftCard) => cardPlayed !== playerThatLeftCard
    )
  )

  //Update all cards available
  const newAllCards = session.allCards.filter((card) =>
    playerThatLeft.cards.every(
      (playerThatLeftCard) => card !== playerThatLeftCard
    )
  )

  // Check whether there are no more cards to be played due to player leaving
  const checkIfFinished = () => {
    if (
      newAllCards.length === newCardsPlayed.length ||
      session.gameOver === true
    ) {
      return false
    } else {
      return true
    }
  }

  const updatedSession = {
    ...session,
    cardsPlayed: newCardsPlayed,
    allCards: newAllCards,
    gameStart: checkIfFinished(),
    playerStates: newPlayerStates,
  }

  //Mutate game state
  const findIndex = sessions.findIndex(
    (session) => session.sessionID === sessionID
  )
  sessions.splice(findIndex, 1, updatedSession)

  return updatedSession
}

module.exports = {
  checkSession,
  initGameState,
  deal,
  joinSession,
  playCard,
  checkGameOver,
  checkGameWon,
  playerLeft,
}
