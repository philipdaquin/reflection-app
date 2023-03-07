import React, { ChangeEvent, HtmlHTMLAttributes, HTMLInputTypeAttribute, useEffect, useState } from 'react'
import { useRecorder } from "react-recorder-voice";
import { convertWav } from '../util/convertWav';
import { uploadWav } from '../util/uploadWav';

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


    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };


    const [audioSource, setAudioSource] = useState('')


    const handleFormSubmit = (e ) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("audioFile", selectedFile);

        fetch("http://localhost:4002/", {
        method: "POST",
        body: formData,
        })
        .then(async (response) => {
            if (response.ok) {
                const blob = await response.blob()
                const url = URL.createObjectURL(blob)
                setAudioSource(url)
            }
        })
        .then((data) => {
            console.log("THIS IS THE DATA", data);
        })
        .catch((error) => {
            console.error(error);
        });
    };
      console.log(audioSource)
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
            
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="audioFile">Select a WAV file:</label>
                    <input
                        type="file"
                        id="audioFile"
                        accept=".wav"
                        onChange={handleFileSelect}
                    />
                <button type="submit">Upload</button>
            </form>
            <audio controls  src={audioSource}></audio>
            <h1>{timer}</h1>
        </div>
    );
}

export default RecordComponent