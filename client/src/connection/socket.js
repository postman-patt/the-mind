import socketClient from 'socket.io-client'

const SERVER = 'http://localhost:4000/'

export const socket = socketClient(SERVER)
