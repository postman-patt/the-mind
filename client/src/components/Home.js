import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
  const [room, setRoom] = useState('')

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

  return (
    <div>
      <label forName='roomCode'>Room Code</label>
      <input
        tpye='text'
        name='roomCode'
        onChange={(e) => setRoom(e.target.value)}
      ></input>
      <Link to={`/play/${room}`}>
        <button>Join Room</button>
      </Link>
      <Link to={`/play/${randomCodeGenerator(4)}`}>
        <button>Create a room</button>
      </Link>
    </div>
  )
}

export default Home
