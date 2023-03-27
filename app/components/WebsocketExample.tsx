import React, { useEffect, useRef, useState } from 'react';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface WebSocketClientProps {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
}

const WebSocketClient: React.FC<WebSocketClientProps> = ({
  url,
  onOpen,
  onClose,
  onMessage,
  onError,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Create a new WebSocket connection using the provided URL
    const newSocket = new WebSocket(url);

    // Set up event listeners for the WebSocket connection
    newSocket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
      if (onOpen) {
        onOpen();
      }
    });

    newSocket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket server');
      if (onClose) {
        onClose();
      }
    });

    newSocket.addEventListener('message', (event) => {
      console.log(`Received message: ${event.data}`);
      setMessage(event.data);
      if (onMessage) {
        try {
          const messageObject: WebSocketMessage = JSON.parse(event.data);
          onMessage(messageObject);
        } catch (error) {
          console.log(`Error parsing message: ${error}`);
        }
      }
    });

    newSocket.addEventListener('error', (event) => {
      console.log(`WebSocket error: ${event}`);
      if (onError) {
        onError(event);
      }
    });

    // Save the new socket instance in the socketRef
    socketRef.current = newSocket;

    // Clean up the WebSocket connection on unmount
    return () => {
      newSocket.close();
    };
  }, [url, onOpen, onClose, onMessage, onError]);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Send a message to the WebSocket server
      const messageObject: WebSocketMessage = {
        type: 'text',
        payload: 'Hello, server!',
      };
      socketRef.current.send(JSON.stringify(messageObject));
    }
  };

  return (
    <div>
      <p>{`Received message: ${message}`}</p>
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
};

export default WebSocketClient;