/// <reference types="vite/client" />

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(SOCKET_URL);
    socket.emit('joinRoom', userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => {
  return socket;
};