import React, { useEffect, useState } from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon, SpeakerWaveIcon, XMarkIcon, StopIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {HiOutlineAnnotation} from 'react-icons/hi'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { useRecoilState } from 'recoil'
import { useRouter } from 'next/router';
import { AudioUrl, RecordingState, TimerState } from '../../atoms/atoms'
import { convertWav } from '../../util/convertWav'
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
    
    const [loading, setLoading] = useState(false)
    const [showRecordingTime, setRecordingTime] = useRecoilState(TimerState);
    const [showRecordingState, setRecordingState] = useRecoilState(RecordingState);
    const [showAudioUrl, setAudioUrl] = useRecoilState(AudioUrl);


    const [transcription, setTranscription] = useState('')
    const [summary, setSummary] = useState<string>('')
    const [relatedTags, setRelatedTags] = useState<string[] | null>(null)

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
    }

    // STARTS FROM THE BEGINNING
    const resetRecordingStates = () => { 
        setStopRecord(false)
        setRecord(false)
        setProcess(false)
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
          .then((resp) => {
              const formData = new FormData();
                formData.append('audio', resp);
                fetch("http://localhost:4001/api/openai-chat", {
                method: "POST",
                body: formData,
              })
              .then(async (response) => {
                  if (response.ok) {
                        const blob = await response.blob()
                        const url = URL.createObjectURL(blob)
                        console.log(url)
                        // setAudioURL(url)
                        setAudioUrl(url)
                  } else { 
                    throw new Error("Failed to get audio file")
                  }
              }) 
              .then(() => { 
                resetRecordingStates()
                setLoading(false)
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
          <div className='bg-[#5d5fef] cursor-pointer rounded-full 
            
          h-[62px] md:h-[185px]  
            w-[185px] md:w-[62px] 
            
            justify-center
            flex items-center
            ' onClick={start}>
            <MicrophoneIcon height={24} width={24} color="white"/>
          </div>
        )
      }
      const STOP = () => { 
        return (
          <div className='bg-[#e84040]  cursor-pointer rounded-full 
          
          h-[62px] md:h-[185px]  
          w-[185px] md:w-[62px]  

          flex items-center 
          justify-center' 
            onClick={stop}>
            <StopIcon height={24} width={24} color="white"/>
          </div>
        )
      }
      // On Process, add loading spinners 
      const CONTINUE = () => { 
        return (
          <div className='bg-[#5d5fef] cursor-pointer rounded-full 
            h-[62px] md:h-[185px]  
            w-[185px] md:w-[62px]  
            flex items-center 
            justify-center' 
            onClick={processAudioRecording}>
            <ChevronRightIcon height={24} width={24} strokeWidth={2} color="white"/>
          </div>
        )
      }
      
      return (
        <>
          {isCurrRecording ? (
            <div className="flex md:flex-col items-center space-x-2">
              <div className='md:pb-2'>
                {stopRecord ? <CONTINUE/> : <STOP/>}
              </div>
              <Button icon={<XMarkIcon height={24} width={24} color="white" strokeWidth={2} onClick={resetRecordingStates} />} />
            </div>
          ) : (
            <START/>
          )}
        </>
      );
  }



function ChatControls() {
  return (
        <>  
          <div className='flex items-center space-x-2 
        relative 
        sm:pt-0
        justify-between
        px-3
        sm:space-x-5 
        sm:pb-0 
        sm:px-4 
        sm:relative 
        sm:bottom-0
        md:space-x-0 
        md:flex-col 
        md:space-y-2 
        md:relative 
        md:right-10 '>
          <StartStopRecording/>
            <div className='md:space-y-2 flex md:flex-col space-x-2 md:space-x-0'>
              <Button icon={<SpeakerWaveIcon  height={24} width={24} color="white"/> }/>  
              <Button icon={<HiOutlineAnnotation  size={24}  color="white"/> }/>  
            </div>
          </div>
        </>
  )
}

export default ChatControls