import React from 'react'
import { useState, useEffect } from 'react'
import Card from './Card'
import Hand from './Hand'
import PlayedCard from './PlayedCard'
import { socket } from '../connection/socket'

export const GameStage = ({ match }) => {
  //Initiate game state
  const [playerId, setPlayerId] = useState('')
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [gameStart, setGameStart] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [cardsPlayed, setCardsPlayed] = useState([])
  const [allCards, setAllCards] = useState([])
  const [level, setLevel] = useState(1)
  const [levelComplete, setLevelComplete] = useState(false)
  const [playerStates, setPlayerStates] = useState([])

  //Run check on gameOver state on any state change
  useEffect(() => {
    //Join room and send your information to other players
    socket.emit('joinRoom', { username, room: match.params.roomCode })

    //Recieve information for players in the room
    socket.on('initGameState', (payload) => {
      setPlayerStates(payload.players)
      setPlayerId(payload.player)
      setRoom(payload.room)
    })

    socket.on(
      'updateGameState',
      ({
        gameStart,
        gameOver,
        cardsPlayed,
        allCards,
        level,
        levelComplete,
        playerStates,
      }) => {
        setGameStart(gameStart)
        setGameOver(gameOver)
        cardsPlayed && setCardsPlayed(cardsPlayed)
        allCards && setAllCards(allCards)
        level && setLevel(level)
        setLevelComplete(levelComplete)
        playerStates && setPlayerStates(playerStates)
      }
    )
    //if player leaves games, remove his cards from the stack
    socket.on('playerLeft', ({ playerThatLeftId }) => {
      console.log(playerThatLeftId)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //GAME LOGIC FUNCTIONS

  useEffect(() => {
    //Check for game over - Should also emit updatedState to all users if true
    checkGameOver()
    //Check for game won
    checkGameWon()
  }, [cardsPlayed, allCards])

  //Generator cards to be dealt
  const numberGenerator = () => {
    return Math.floor(Math.random() * 100 + 1)
  }

  //Deal cards to player
  const deal = () => {
    //Set back to initial state
    setPlayerStates([])
    setAllCards([])
    setCardsPlayed([])
    setGameOver(false)
    setLevelComplete(false)
    setGameStart(true)

    const players = playerStates
    const allCardsDealt = []
    for (let i = 0; i < level; i++) {
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
    setPlayerStates(players)
    setAllCards(allCardsDealt)
    socket.emit('updateGameState', {
      levelComplete: false,
      gameStart: true,
      gameOver: false,
      playerStates: players,
      cardsPlayed: [],
      allCards: allCardsDealt,
    })
  }

  //Play cards
  const playCard = (value, player) => {
    const playerWithCard = playerStates.filter((item) => item.id === player)[0]
    const updatedPlayerStates = {
      id: playerWithCard.id,
      cards: playerWithCard.cards.filter((card) => card !== value),
    }
    setCardsPlayed([...cardsPlayed, value])
    setPlayerStates(
      playerStates.map((item) =>
        item.id === updatedPlayerStates.id ? updatedPlayerStates : item
      )
    )

    const updatedCardsPlayed = [...cardsPlayed, value]
    const newPlayerStates = playerStates.map((item) =>
      item.id === updatedPlayerStates.id ? updatedPlayerStates : item
    )
    socket.emit('updateGameState', {
      cardsPlayed: updatedCardsPlayed,
      playerStates: newPlayerStates,
    })
  }

  //Check whether game has ended
  const checkGameOver = () => {
    const sortedAllCards = allCards
      .sort((a, b) => a - b)
      .slice(0, cardsPlayed.length)
    if (sortedAllCards.toString() !== cardsPlayed.toString()) {
      //remove all cards from all players
      const players = playerStates.map((player) => ({ ...player, cards: [] }))
      console.log(sortedAllCards.toString())
      console.log(cardsPlayed.toString())
      socket.emit('updateGameState', {
        gameOver: true,
        gameStart: false,
        playerStates: players,
      })
      setGameStart(false)
      setGameOver(true)
    }
  }

  //Check whether game has been won
  const checkGameWon = () => {
    if (cardsPlayed.length > 1 && cardsPlayed.length === allCards.length) {
      //remove all cards from all players
      const players = playerStates.map((player) => ({ ...player, cards: [] }))
      setLevel(level + 1)
      setLevelComplete(true)
      setGameStart(false)
      socket.emit('updateGameState', {
        level: level + 1,
        levelComplete: true,
        gameStart: false,
        playerStates: players,
      })
    }
  }

  //If player leaves
  const playerLeft = (id) => {
    const playerThatLeft = playerStates.filter((player) => player.id === id)
    console.log(playerStates)

    const newPlayerStates = playerStates.filter(
      (player) => player.id !== playerThatLeft.id
    )
    const newCardsPlayed = cardsPlayed.filter((cardPlayed) =>
      playerThatLeft.cards.every(
        (playerThatLeftCard) => cardPlayed !== playerThatLeftCard
      )
    )
    const newAllCards = allCards.filter((card) =>
      playerThatLeft.cards.every(
        (playerThatLeftCard) => card !== playerThatLeftCard
      )
    )
    console.log(newCardsPlayed)
    console.log(newAllCards)
    console.log(newPlayerStates)
  }
  return (
    <>
      <h2>{`Room: ${room}`}</h2>
      {!gameStart && (
        <button
          onClick={() => {
            deal()
          }}
        >
          Deal
        </button>
      )}
      {!gameOver ? (
        !levelComplete ? (
          <div className='gameStage'>
            {cardsPlayed.map((card, index) => (
              <PlayedCard value={card} key={index} />
            ))}
          </div>
        ) : (
          <h1>LEVEL COMPLETE</h1>
        )
      ) : (
        <h1>GAME OVER</h1>
      )}

      <div>
        {playerStates.map((player, index) => (
          <Hand key={index}>
            <p>{`Player: ${player.id}`}</p>
            {player.cards.map((card, index) => (
              <Card
                value={card}
                player={player.id}
                key={index}
                playCard={playCard}
              />
            ))}
          </Hand>
        ))}
      </div>
    </>
  )
}

export default GameStage
