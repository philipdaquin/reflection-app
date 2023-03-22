import React, { ChangeEvent, HtmlHTMLAttributes, HTMLInputTypeAttribute, useEffect, useState } from 'react'
import { useRecorder } from "react-recorder-voice";
import { convertWav } from '../util/convertWav';
import { uploadWav } from '../util/uploadWav';
import io from 'socket.io-client';
import AddAudioFile from './AddAudioFile';
import AudioStreaming from './AudioStreaming';
import AudioStreamer from './AudioStreamer';



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
    const [audioRecording, setAudioRecording] = useState<string>('')
    const [micSource, setMicSource] = useState<string>('')
    useEffect(() => { 
        if (audioData == null) return 
            // Convert to Wav
        convertWav(audioData)
            // Upload to server and get the response 
            .then((resp) => {
                const formData = new FormData();
                formData.append('audio', resp);
                fetch("http://localhost:4001/", {
                method: "POST",
                body: formData,
                })
                .then(async (response) => {
                    if (response.ok) {
                        const blob = await response.blob()
                        const url = URL.createObjectURL(blob)
                        setAudioRecording(url)
                    }
                })
                .catch((error) => {
                   throw new Error(error)
                });
            })
        
    }, [audioData])

    const convert = async () => { 
        convertWav(audioData)
        .then((res) => { 
            const url = URL.createObjectURL(res)
            setMicSource(url)
        })
    }
    useEffect(() => {
        if (audioData == null) return;
        convert()
    }, [audioData])
    

      return (
        <div className='space-y-7 items-center'>
            <div className='mb-2 font-bold text-xl uppercase'>
                {recordingStatus}
            </div>

             <div className='space-x-6 '>
                <button className='p-2 px-5 text-white bg-black rounded-md font-bold' 
                    onClick={start}>Start</button>
                <button hidden={record} onClick={cancel}>Cleared</button>
                <button hidden={!record} onClick={save}>Stop and Save</button>
            </div>

            <AudioStreamer />

            <div>
                <h1 className="font-bold text-md">
                    INSERT AUDIO FILE``
                </h1>
                <AddAudioFile />
            </div>


            {/* <div>
                <h1 className="font-bold text-md">
                    Converted to Wav
                </h1>
                <audio controls  autoPlay src={micSource}></audio>
            </div>

            <div>
                <h1 className="font-bold text-md">Server Response</h1>
                <audio controls  autoPlay src={audioRecording}></audio>
            </div> */}

        </div>
    );
}

export default RecordComponent