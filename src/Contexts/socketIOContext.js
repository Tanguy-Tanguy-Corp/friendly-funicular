import { createContext } from 'react';
import { io } from 'socket.io-client';

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL;

const socket = io(backendURL);
const SocketContext = createContext({
  socket: socket
});

export { socket, SocketContext };
