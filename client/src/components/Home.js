import React from 'react'
import { useState, useEffect } from 'react'
import { socket } from '../connection/socket'
import Header from './Header'
import Footer from './Footer'
import { Row, Col, Button, Form, Container } from 'react-bootstrap'

export const Home = ({ history }) => {
  const [sessionID, setSessionID] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  //Generate room code
  const randomCodeGenerator = (length) => {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  const handleJoinSession = (room) => {
    if (name !== '') {
      socket.emit('checkIfSessionExists', sessionID)
    } else {
      setMessage('Please insert name')
    }
  }

  const handleCreateRoom = () => {
    if (name !== '') {
      history.push(`/play/${name}/${randomCodeGenerator(4)}`)
    } else {
      setMessage('Please insert name')
    }
  }

  useEffect(() => {
    //Retrieve server reply for whether room exists
    socket.on('serverReply', (payload) => {
      console.log(payload)
      if (payload) {
        console.log(sessionID)
        history.push(`/play/${name}/${sessionID}`)
      } else {
        setMessage('Room does not exists...')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionID])

  return (
    <div className='homepage'>
      <Container>
        <Row>
          <Header />
        </Row>
        {message && (
          <Row md={6} className='justify-content-md-center'>
            <Col className='d-flex justify-content-center'>
              <p>{message}</p>{' '}
            </Col>
          </Row>
        )}
        <Row className='justify-content-md-center mb-3'>
          <Col md={4}>
            <Form.Control
              id='sessionCode'
              placeholder='Name'
              label='Name'
              type='text'
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
        </Row>
        <Row className='justify-content-md-center mb-3'>
          <Col md={4}>
            <Form.Control
              id='sessionCode'
              placeholder='Room Code'
              label='Session Code'
              type='text'
              onChange={(e) => setSessionID(e.target.value)}
            />
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col xs={6} md={2} className='d-flex justify-content-center'>
            <Button
              size='lg'
              className='homepage-button p-4'
              variant='light'
              onClick={() => {
                handleJoinSession(sessionID)
              }}
            >
              Join Room
            </Button>
          </Col>
          <Col xs={6} md={2} className='d-flex justify-content-center'>
            <Button
              className='homepage-button p-2'
              size='lg'
              variant='light'
              onClick={() => handleCreateRoom()}
            >
              Create a room
            </Button>
          </Col>
        </Row>
        <Row className='justify-content-md-center mt-5'>
          <Col className='d-flex justify-content-center'>
            <Footer />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home
