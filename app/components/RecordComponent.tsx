import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRecorder } from "react-recorder-voice";
import { convertWav } from '../util/convertWav';
import { uploadWav } from '../util/uploadWav';

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


    const [audioRecording, setAudioRecording] = useState(null)

    useEffect(() => {
        console.log(audioData)

        if (audioData == null) return 
        convertWav(audioData)
            .then(resp => uploadWav(resp))
    }, [audioData])


    const [fileList, setFileList] = useState<FileList | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFileList(e.target.files);
    };


    const [recording, isRecording] = useState(false)

    return (
        <div className='space-y-7 items-center'>
            <div className='mb-2 font-bold text-xl uppercase'>
                {recordingStatus}
            </div>

            <div className='space-x-6 '>
                <button className='p-2 px-5 text-white bg-black rounded-md font-bold' onClick={start}>Start</button>
                <button hidden={record} onClick={cancel}>Cleared</button>
                <button hidden={!record} onClick={save}>Stop and Save</button>




            </div>

            <audio controls  src={audioURL}></audio>
            <h1>{timer}</h1>
        </div>
    );
}

export default RecordComponent