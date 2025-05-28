'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Create a simulated socket context that doesn't continually poll
interface SocketContextType {
  isConnected: boolean;
  error: string | null;
  sendMessage: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  error: null,
  sendMessage: () => {}
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<{event: string, data: any} | null>(null);

  // We're simulating the socket connection to avoid excessive API calls
  // This provider no longer makes continuous polling requests
  
  useEffect(() => {
    // Simulate initial connection
    console.log('Socket simulation initialized');
    setIsConnected(true);
    
    return () => {
      console.log('Socket simulation disconnected');
      setIsConnected(false);
    };
  }, []);

  // Simulate sending a message
  const sendMessage = (event: string, data: any) => {
    // Store the last message for debugging purposes
    setLastMessage({event, data});
    
    // Log the event but don't actually send anything to the server
    console.log(`Socket event simulated: ${event}`, data);
  };
  
  // Expose the socket context values
  const value = {
    isConnected,
    error,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider; 