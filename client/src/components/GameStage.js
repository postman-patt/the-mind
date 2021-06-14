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
  const [sessionID, setSessionID] = useState('')
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
    socket.emit('joinRoom', { username, sessionID: match.params.roomCode })

    //Recieve information for initial state and players in the room
    socket.on('initGameState', ({ gameState, player }) => {
      setPlayerStates(gameState.playerStates)
      setPlayerId(player)
      setSessionID(gameState.sessionID)
    })

    socket.on(
      'updateGameState',
      ({
        sessionID,
        gameStart,
        gameOver,
        cardsPlayed,
        allCards,
        level,
        levelComplete,
        playerStates,
      }) => {
        setSessionID(sessionID)
        setGameStart(gameStart)
        setGameOver(gameOver)
        setCardsPlayed(cardsPlayed)
        setAllCards(allCards)
        setLevel(level)
        setLevelComplete(levelComplete)
        setPlayerStates(playerStates)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //GAME LOGIC FUNCTIONS

  //Deal cards to player
  const deal = () => {
    socket.emit('dealCards', sessionID)
  }

  //Play cards and check if game over OR game won
  const playCard = (value, player) => {
    socket.emit('playCard', { sessionID, value, player })
    checkGameWon(sessionID)
    checkGameOver(sessionID)
  }

  //Check if game has ended
  const checkGameOver = () => {
    socket.emit('checkGameOver', sessionID)
  }

  //Check if game has been won
  const checkGameWon = () => {
    socket.emit('checkGameWon', sessionID)
  }

  return (
    <>
      <h2>{`Room: ${sessionID}`}</h2>
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
