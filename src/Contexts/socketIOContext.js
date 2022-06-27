import { createContext } from 'react';
import { io } from 'socket.io-client';

const backendURL = process.env.REACT_APP_BACKEND_URL;

export const socket = io(backendURL);
export const SocketContext = createContext();
