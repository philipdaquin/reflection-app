import React, { useEffect, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import io, { Socket } from 'socket.io-client';
import { convertWav } from '../util/convertWav';

const SERVER_URL = 'ws://localhost:3000';

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

  const [socket, setSocket] = useState<Socket | null>(null);
  const [startStream, setStartStream] = useState<boolean>(false);

  const start = (): void => {
    setStartStream(true);
    startRecording();
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);
  };

  const stop = (): void => {
    setStartStream(false);
    stopRecording();
    socket?.disconnect();
  };

  const sendAudioChunk = async (chunk: Blob): Promise<void> => {
    const convertedChunk = await convertWav(chunk);
    socket?.emit('audioChunk', convertedChunk);
  };

  useEffect(() => {
    if (startStream && recordingBlob) {
      sendAudioChunk(recordingBlob);
    }
  }, [recordingBlob, startStream, socket]);

  return (
    <div>
      <div className='mb-2 font-bold text-xl uppercase'>
        {isRecording ? 'Recording' : 'Not recording'} | Timer: {recordingTime}
      </div>

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
