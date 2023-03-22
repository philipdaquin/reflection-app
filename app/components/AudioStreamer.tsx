import React, { useState, useRef } from 'react';
import io, {Socket} from 'socket.io-client';
import { convertWav } from '../util/convertWav';

const SERVER_URL = 'ws://localhost:4001/ws'// Replace with your server URL

const AudioStreamer = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStart = async () => {
    try {
      console.log('CONNECTING TO THIS WEBSOCKET');

      // Initialize the media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize the media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorderRef.current.ondataavailable = handleDataAvailable;

      // Connect to the WebSocket server
      socketRef.current = io(SERVER_URL, {
        transports: ['websocket'], // Use the WebSocket transport
        upgrade: false, // Disable the default upgrade behavior
        forceNew: true, // Force a new connection
        extraHeaders: {
          'Upgrade': 'websocket', // Add the required headers
          'Connection': 'Upgrade',
        },
      });;
      
      // socketRef.current.open = () => console.log("WS OPEN");


      socketRef.current.on('connect', handleConnect);

      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDataAvailable = async (event: BlobEvent) => {
    if (socketRef.current && socketRef.current.connected) {
      let wavFile = await convertWav(event.data)
      socketRef.current.binary(true).emit('audio', wavFile);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? handleStop : handleStart}>{isRecording ? 'Stop' : 'Start'}</button>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
    </div>
  );
};

export default AudioStreamer;