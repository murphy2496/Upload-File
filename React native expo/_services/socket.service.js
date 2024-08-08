import { io } from 'socket.io-client'

const socket = io('http://192.168.135.215:4448')

export default socket