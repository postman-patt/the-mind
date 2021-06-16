import React from 'react'
import { useState, useEffect } from 'react'
import Card from './Card'
import Hand from './Hand'
import PlayedCard from './PlayedCard'
import { socket } from '../connection/socket'

//Bootstrap Imports
import { Row, Col, Button, Container } from 'react-bootstrap'

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

    //Retrieve your own id

    socket.on('setPlayerId', (playerId) => {
      setPlayerId(playerId)
    })

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
        player,
      }) => {
        setSessionID(sessionID)
        setGameStart(gameStart)
        setGameOver(gameOver)
        setCardsPlayed(cardsPlayed)
        setAllCards(allCards)
        setLevel(level)
        setLevelComplete(levelComplete)
        setPlayerStates(playerStates)
        player && setPlayerId(player)
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
      <Container fluid>
        <Row className='justify-content-md-center'>
          <Col md={4} className='d-flex justify-content-center'>
            <h1>{`Room: ${sessionID}`}</h1>
          </Col>
        </Row>
        {!gameStart && (
          <Row className='justify-content-md-center'>
            <Col md={6} className='d-flex justify-content-center p-5'>
              <Button
                className='deal-button px-5'
                variant='light'
                size='lg'
                onClick={() => {
                  deal()
                }}
              >
                Deal
              </Button>
            </Col>
          </Row>
        )}
        {!gameOver ? (
          !levelComplete ? (
            <div className='gameStage'>
              <h1>Cards Played</h1>
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
          {playerStates.map(
            (player, index) =>
              playerId === player.id && (
                <Hand key={index}>
                  <Row xs={12} className='justify-content-md-center'>
                    <Col md={6} className='d-flex justify-content-center'>
                      <h1>{`Player: ${player.id}`}</h1>
                    </Col>
                  </Row>
                  <Row xs={12} className='justify-content-md-center'>
                    {player.cards.map((card, index) => (
                      <Col md={3} className='d-flex justify-content-center'>
                        <Card
                          value={card}
                          player={player.id}
                          key={index}
                          playCard={playCard}
                        />{' '}
                      </Col>
                    ))}
                  </Row>
                </Hand>
              )
          )}
        </div>
      </Container>
    </>
  )
}

export default GameStage
