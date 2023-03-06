import React, { useEffect, useState } from 'react'
import { useRecorder } from "react-recorder-voice";
import { convertWav } from '../util/convertWav';

function RecordComponent() {
    const {
        audioURL,
        audioData,
        timer,
        recordingStatus,
        cancelRecording,
        saveRecordedAudio,
        startRecording,

    } = useRecorder();


    const [record, setRecord] = useState(false)
    const [stopRecord, setStopRecord] = useState(false)
    
    const start = () => {   
        setRecord(true)
        startRecording()
        setStopRecord(false)
    }

    const cancel = () => {  
        
        setStopRecord(true)
        cancelRecording()
        setRecord(false)
    }

    const save = () => { 
        setStopRecord(true)
        saveRecordedAudio()
        setRecord(false)

    }

    // useEffect(() => {
    //   first
    
    //   return () => {
    //     second
    //   }
    // }, [third])
    

    // convertWav(audioData)

    const [recording, isRecording] = useState(false)

    return (
        <div className='space-y-7 items-center'>
            <div className='mb-2 font-bold text-xl uppercase'>
                {recordingStatus}
            </div>

            <div className='space-x-6 '>
                <button className='p-2 px-5 text-white bg-black rounded-md font-bold' onClick={start}>Start</button>
                <button hidden={!record} onClick={cancel}>Cancel</button>
                <button hidden={!record} onClick={save}>Stop and Save</button>
            </div>

            <audio controls  src={audioURL}></audio>
            <h1>{timer}</h1>
        </div>
    );
}

export default RecordComponent