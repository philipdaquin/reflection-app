import React, { useEffect, useState } from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon, SpeakerWaveIcon, XMarkIcon, StopIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {HiOutlineAnnotation} from 'react-icons/hi'
import { useRecorder } from 'react-recorder-voice'
import { convertWav } from '../util/convertWav'

interface Props { 
  icon: any
}

function Button({icon}: Props) { 
    return (
        <div className='bg-[#424242] rounded-full w-[42px] h-[42px] cursor-pointer items-center justify-center flex p-2'>
          {icon}
        </div>
    )
}

function StartStopRecording() { 

    const {
       // audioURL,
       audioData,
       timer,
       recordingStatus,
       cancelRecording,
       saveRecordedAudio,
       startRecording,

    } = useRecorder()

    const [isRecording, setRecord] = useState(false)
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
      if (recordingStatus !== 'recording') return;
        setStopRecord(true)
        saveRecordedAudio()
    }

    // SAVES THE DATA AND MOVE TO THE NEXT STAGE 
    const processAudioRecording = () => { 
        if (audioData == null) return
        setProcess(true)
        saveRecordedAudio()
    }

    // STARTS FROM THE BEGINNING
    const resetRecordingStates = () => { 
        setStopRecord(false)
        setRecord(false)
        setProcess(false)
        saveRecordedAudio()
        cancelRecording()
    }
    
    // Listener: 
    // Once Process == true, convert and send over to the server
    // Next, if all ok, reset Recording states to default 
    useEffect(() => { 
        if (!process) return 
        if (audioData == null) return 
        setLoading(true)
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
                      setAudioURL(url)
                      // Once done, Reset the Recording States
                      resetRecordingStates()
                      setLoading(false)
                  }
              })
              .catch((error) => {
                setLoading(false)
                throw new Error(error)
              });
          })
        
    }, [audioData, process])

      const START = () => { 
        return (
          <div className='bg-[#5d5fef] cursor-pointer rounded-full h-[185px] flex items-center w-[62px] justify-center' 
            onClick={start}>
            <MicrophoneIcon height={24} width={24} color="white"/>
          </div>
        )
      }
      const STOP = () => { 
        return (
          <div className='bg-[#e84040]  cursor-pointer rounded-full h-[185px] flex items-center w-[62px] justify-center' 
            onClick={stop}>
            <StopIcon height={24} width={24} color="white"/>
          </div>
        )
      }
      const CONTINUE = () => { 
        return (
          <div className='bg-[#5d5fef] cursor-pointer rounded-full h-[185px] flex items-center w-[62px] justify-center' 
            onClick={processAudioRecording}>
            <ChevronRightIcon height={24} width={24} strokeWidth={2} color="white"/>
          </div>
        )
      }
      
      return (
        <>
          {isRecording ? (
            <div className=" items-center space-y-2 flex flex-col justify-center">
              {stopRecord ? <CONTINUE/> : <STOP/>}
              <Button icon={<XMarkIcon height={24} width={24} color="white" strokeWidth={2} onClick={resetRecordingStates} />} />
            </div>
          ) : (
            <START/>
          )}
        </>
      );
  }



function AudioControls() {
  return (
      <div className='flex flex-col  items-center justify-between space-y-3'>
          <StartStopRecording/>
          <div className='space-y-2'>
            <Button icon={<SpeakerWaveIcon  height={24} width={24} color="white"/> }/>  
            <Button icon={<HiOutlineAnnotation  size={24}  color="white"/> }/>  
          </div>
      </div>
  )
}

export default AudioControls