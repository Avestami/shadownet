import { io as createSocket } from 'socket.io-client';

let socket: any;

export const initSocket = () => {
  if (!socket) {
    socket = createSocket(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['polling'], // Use polling instead of WebSocket for better compatibility
      path: '/api/socket',
      addTrailingSlash: false,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
    });
  }
  return socket;
};

export const getSocket = () => socket; 