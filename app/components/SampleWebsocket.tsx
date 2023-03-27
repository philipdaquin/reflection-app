import { useEffect, useState } from "react";
import { WebSocketClientProps } from "./WebsocketExample";

const WebSocketClient: React.FC<WebSocketClientProps> = ({ url, onMessage }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
  
    useEffect(() => {
      const newSocket = new WebSocket(url);
      setSocket(newSocket);
  
      return () => {
        newSocket.close();
      };
    }, [url]);
  
    useEffect(() => {
      if (socket) {
        socket.onmessage = (event) => {
          const message = event.data;
          onMessage({
            payload: "",
            type: ""
          });
        };
      }
    }, [socket, onMessage]);
  
    const sendMessage = (message: string) => {
      if (socket) {
        socket.send(message);
      }
    };
  
    return (
      <div>
        <button onClick={() => sendMessage('Hello, server!')}>Send message</button>
      </div>
    );
  };