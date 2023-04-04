import React, { ChangeEvent, HtmlHTMLAttributes, HTMLInputTypeAttribute, useEffect, useState } from 'react'
import { convertWav } from '../util/convertWav';
import { uploadWav } from '../util/uploadWav';
import AddAudioFile from './AddAudioFile';
import AudioStreaming from './AudioStreaming';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import WebSocketClient from './WebsocketClient';



function RecordComponent() {
    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
  
      } = useAudioRecorder();
  
  
      const [isCurrRecording, setRecord] = useState(false)
      const [stopRecord, setStopRecord] = useState(false)
      const [process, setProcess] = useState(false)
      
      const [audioURL, setAudioURL] = useState('')
      const [loading, setLoading] = useState(false)
  
      // START THE RECORDING
      const start = () => {   
          setRecord(true)
          startRecording()
          setStopRecord(false)
          setProcess(false)
      }
  
      // STOP THE RECORDING
      const stop = () => {  
        if (!isRecording) return
        stopRecording()
        setStopRecord(true)
        processAudioRecording()
      }
      
      // SAVES THE DATA AND MOVE TO THE NEXT STAGE 
      const processAudioRecording = () => { 
          if (recordingBlob == null) return
          setProcess(true)
          // saveRecordedAudio()
      }
  
      // STARTS FROM THE BEGINNING
      const resetRecordingStates = () => { 
          setStopRecord(false)
          setRecord(false)
          setProcess(false)
          // saveRecordedAudio()
          stopRecording()
      }
      // Listener: 
      // Once Process == true, convert and send over to the server
      // Next, if all ok, reset Recording states to default 
      useEffect(() => { 
          if (!process) return 
          if (recordingBlob == null) return 
          setLoading(true)
          
          // Convert to Wav
          convertWav(recordingBlob)
            // Upload to server and get the response 
            .then((resp) => {

                const formData = new FormData();
                formData.append('audio', resp);
                fetch("http://localhost:4001/api/upload", {
                    method: "POST",
                    body: formData,
                })
                .then(async (response) => {


                    const url = URL.createObjectURL(resp)
                    setAudioURL(url)

                    if (response.ok) {
                        const blob = await response.blob()
  
                        // let id = blob.name
                        // console.log(id)
                        // console.log(blob)
  
                        // Testing purposes 
                        // const url = URL.createObjectURL(blob)
                        // setAudioURL(url)
                        // console.log(url)
                        // Once done, route the user to the post summary with the id
                        // router.push(`/post_analysis/${id}`)
  
  
                        // Once done, Reset the Recording States
                        // resetRecordingStates()
                        // setLoading(false)
                    }
                })
                .catch((error) => {
                  setLoading(false)
                  resetRecordingStates()
                  throw new Error(error)
                });
            })
          
      }, [recordingBlob, process])
    
      const handleWebSocketMessage = (message: string) => {
        console.log(`Received message: ${message}`);
      };


      useEffect(() => {
        if (recordingBlob == null) return
        const url = URL.createObjectURL(recordingBlob)
        setAudioURL(url)
      }, [recordingBlob])
      

    
      return (
        <div className='space-y-7 items-center'>
            <div className='mb-2 font-bold text-xl uppercase'>
                {isRecording ? "Recording" : "NOT RECORDING"}
            </div>



            {/* <WebSocketClient /> */}

 
            <h1>Helo</h1>

             <div className='space-x-6 '>
                <button className='p-2 px-5 text-white bg-black rounded-md font-bold' 
                    onClick={start}>Start</button>
                <button hidden={isCurrRecording} onClick={resetRecordingStates}>Cleared</button>
                <button hidden={!isCurrRecording} onClick={stop}>Stop and Save</button>
            </div>
            <div>
                <h1 className="font-bold text-md">Server Response</h1>
                <audio controls  autoPlay src={audioURL}></audio>
            </div>

            {/* <AudioStreaming /> */}

            <div>
                <h1 className="font-bold text-md">
                    INSERT AUDIO FILE``
                </h1>
                <AddAudioFile />
            </div>

{/* 
            <div>
                <h1 className="font-bold text-md">
                    Converted to Wav
                </h1>
                <audio controls  autoPlay src={micSource}></audio>
            </div> */}

    
        </div>
    );
}

export default RecordComponent