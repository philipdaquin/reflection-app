import React, { useEffect, useRef, useState } from 'react'
import { useRecorder } from 'react-recorder-voice';
import { Socket } from 'socket.io';
import io from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


function AudioStreaming() {
            
    const [startStream, setStartStream] = useState(false)
    const {
        // audioURL,
        audioData,
        timer,
        recordingStatus,
        cancelRecording,
        saveRecordedAudio,
        startRecording,

    } = useRecorder();

    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

    const start = () => { 
        setStartStream(true)
        startRecording()
        socketRef.current = io("https://localhost:4001")
    }

    const stop = () => { 
        setStartStream(true)
        saveRecordedAudio
        socketRef.current?.disconnect()
        saveRecordedAudio()
    }
    

    useEffect(() => { 

        if (startStream) {
            socketRef.current?.emit('audioData', audioData)
        }

    }, [startStream])


    return (
        <div>
            <div className='mb-2 font-bold text-xl uppercase'>
                {recordingStatus} | timer: {timer}
            </div>

            <div className='space-x-6 '>
                <button className='p-2 px-5 text-white bg-black rounded-md font-bold' 
                        onClick={start}>Start</button>
                <button onClick={stop}>stop</button>
            </div>
        </div>
    )
}

export default AudioStreaming