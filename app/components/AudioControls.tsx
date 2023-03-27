import React, { useEffect, useState } from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon, SpeakerWaveIcon, XMarkIcon, StopIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {HiOutlineAnnotation} from 'react-icons/hi'
import { convertWav } from '../util/convertWav'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { useRecoilState } from 'recoil'
import { RecordingState, TimerState } from '../atoms/atoms'
import formatTime from '../util/formatTime'
import { useRouter } from 'next/router';
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
    const [showRecordingTime, setRecordingTime] = useRecoilState(TimerState);
    const [showRecordingState, setRecordingState] = useRecoilState(RecordingState);

    const router = useRouter();

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
      setRecordingState(false)

    }
    
    // SAVES THE DATA AND MOVE TO THE NEXT STAGE 
    const processAudioRecording = () => { 
        if (recordingBlob == null) return
        setProcess(true)
        setRecordingTime(0)
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

    useEffect(() => {
      setRecordingTime(recordingTime)
      setRecordingState(isRecording)
    }, [recordingTime, isRecording, loading])

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
              fetch("http://localhost:4001/", {
              method: "POST",
              body: formData,
              })
              .then(async (response) => {
                  if (response.ok) {
                      const blob = await response.blob()

                      let id = blob.name
                      console.log(id)
                      console.log(blob)

                      // Testing purposes 
                      const url = URL.createObjectURL(blob)
                      setAudioURL(url)
                      console.log(url)
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
      // On Process, add loading spinners 
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
          {isCurrRecording ? (
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