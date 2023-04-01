import React, { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { convertWav } from '../util/convertWav';
import useWebSocket from 'react-use-websocket';

// const SERVER_URL = 'ws://localhost:4001/ws ';
const SERVER_URL = 'ws://localhost:4002';

function AudioStreaming() {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder();

  const [startStream, setStartStream] = useState<boolean>(false);
  const didUnmount = useRef(false);

  const {sendMessage, lastMessage, readyState, lastJsonMessage, getWebSocket} = useWebSocket(SERVER_URL, {
    shouldReconnect: (closeEvent) => {
      /*
      useWebSocket will handle unmounting for you, but this is an example of a 
      case in which you would not want it to automatically reconnect
    */
      return didUnmount.current === false;
    },
    onOpen(event) { console.log("Opened new Connection") },
    retryOnError: true, 
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: false

  });

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  //  Audio Controls 
  const start = (): void => {
    setStartStream(true);
    startRecording();
  };


  const stop = (): void => {
    setStartStream(false);
    stopRecording();
  };

  const sendAudioChunk = async (chunk: Blob): Promise<void> => {
    await convertWav(chunk)
      .then((resp) => { 
        if (readyState === 1) { // check if websocket connection is open
          sendMessage(resp)
          console.log("Sending Blobs to server!")
        }
      }).catch(e => console.log);

    // Send over to websocket
    
  };
  useEffect(() => {
    console.log("Sending Data Over")
    const intervalId = setInterval(() => {
      if (startStream && recordingBlob) {
        sendAudioChunk(recordingBlob);
      }
    }, 1000); // send every 1 second
    return () => clearInterval(intervalId);
  }, [recordingBlob, startStream]);

  // useEffect(() => {
  //     if (startStream && recordingBlob) {
  //       sendAudioChunk(recordingBlob);
  //     }
  // }, [recordingBlob, startStream]);
  useEffect(() => {
    const socket = getWebSocket();
    socket?.addEventListener('close', () => {
      console.log('WebSocket closed unexpectedly. Reconnecting...');
      setTimeout(() => {
        socket.addEventListener('open', () => {
          console.log('WebSocket reconnected.');
        });
        socket.close();
        console.log('WebSocket closing.');
      }, 1000);
    });
  }, [getWebSocket]);
  return (
    <div>
      <div className='mb-2 font-bold text-xl uppercase'>
        {isRecording ? 'Recording' : 'Not recording'} | Timer: {recordingTime}
      </div>
      <div>Ready State: {readyState}</div>
      <div>Last Message: {lastMessage ? lastMessage.data : null}</div>
      <div className='space-x-6'>
        <button
          className='p-2 px-5 text-white bg-black rounded-md font-bold'
          onClick={start}
          disabled={isRecording}
        >
          Start
        </button>
        <button onClick={stop} disabled={!isRecording}>
          Stop
        </button>
      </div>
    </div>
  );
}

export default AudioStreaming;
