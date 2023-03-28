import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketClient = () => {
  const [message, setMessage] = useState('');
  const {sendMessage, lastMessage, readyState, lastJsonMessage} = useWebSocket('ws://localhost:4001/ws');

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
      <div>Ready State: {readyState}</div>
      <div>Last Message: {lastMessage ? lastMessage.data : null}</div>
    
    </div>
  );
};

export default WebSocketClient;