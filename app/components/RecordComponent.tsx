import React, { ChangeEvent, HtmlHTMLAttributes, HTMLInputTypeAttribute, useEffect, useState } from 'react'
import { useRecorder } from "react-recorder-voice";
import { convertWav } from '../util/convertWav';
import { uploadWav } from '../util/uploadWav';
import io from 'socket.io-client';
import AddAudioFile from './AddAudioFile';
import AudioStreaming from './AudioStreaming';



function RecordComponent() {
    const {
        // audioURL,
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
        // cancelRecording()
        setRecord(false)
    }

    const save = () => { 
        setStopRecord(true)
        saveRecordedAudio()
        setRecord(false)

    }
    const [audioRecording, setAudioRecording] = useState(null)




      return (
        <div className='space-y-7 items-center'>
            <div className='mb-2 font-bold text-xl uppercase'>
                {recordingStatus}
            </div>

            {/* <div className='space-x-6 '>
                <button className='p-2 px-5 text-white bg-black rounded-md font-bold' 
                    onClick={start}>Start</button>
                <button hidden={record} onClick={cancel}>Cleared</button>
                <button hidden={!record} onClick={save}>Stop and Save</button>

            </div> */}
            <AddAudioFile />
            

            <AudioStreaming />
            {/* <h1>{timer}</h1> */}
        </div>
    );
}

export default RecordComponent