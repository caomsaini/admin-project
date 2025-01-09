import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const connectWebSocket = () => {
      if (reconnectAttempts > 10) return; // Stop reconnection after 10 attempts
      const ws = new WebSocket('ws://localhost:8080');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setReconnectAttempts(0); // Reset attempts
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(() => {
          setReconnectAttempts((attempts) => attempts + 1);
          connectWebSocket();
        }, 5000); // Wait 5 seconds before retrying
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setSocket(ws);
    };

    connectWebSocket();
    return () => socket && socket.close();
  }, [reconnectAttempts]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
