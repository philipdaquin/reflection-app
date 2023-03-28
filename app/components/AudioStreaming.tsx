import React, { useEffect, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { convertWav } from '../util/convertWav';
import useWebSocket from 'react-use-websocket';

const SERVER_URL = 'ws://localhost:4001/ws';

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


  const {sendMessage, lastMessage, readyState, lastJsonMessage} = useWebSocket(SERVER_URL);

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
    const intervalId = setInterval(() => {
      if (startStream && recordingBlob) {
        sendAudioChunk(recordingBlob);
      }
    }, 1000); // send every 1 second

    return () => clearInterval(intervalId);
  }, [recordingBlob, startStream]);

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
