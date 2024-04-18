import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected ");
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

    return () => {
      if (ws.readyState === WebSocket.CLOSED) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      console.log("check ", socket, socket.readyState, message);
      socket.send(JSON.stringify(message));
    }
  };

  const value = { data, sendMessage, isConnected };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
