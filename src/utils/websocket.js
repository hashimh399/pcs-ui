import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState(null);
  const [data, setData] = useState({});
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true); // Update the connection status
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received:", message);
      setData((prevData) => ({ ...prevData, [message.api]: message.data }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected.");
      setIsConnected(false); // Update the connection status
    };

    // Set the WebSocket object in state after all event listeners are added
    setWebSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.CLOSED) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (webSocket && isConnected && webSocket.readyState === WebSocket.OPEN) {
      // Check connection status before sending
      const messageString =
        typeof message === "string" ? message : JSON.stringify(message);
      webSocket.send(messageString);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const value = { data, sendMessage };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
