import React, { useEffect, useState } from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon, SpeakerWaveIcon, XMarkIcon, StopIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {HiOutlineAnnotation} from 'react-icons/hi'
import { convertWav } from '../util/convertWav'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { useRecoilState } from 'recoil'
import { RecordingState, TimerState } from '../atoms/atoms'
import formatTime from '../util/formatTime'
import { useRouter } from 'next/router';
import { getTextSummary } from '../util/getTextSummary'
import { getRelatedTags } from '../util/getRelatedTags'
import useAudioRecording from '../hooks/AudioRecorder'
import { uploadAudioRecording } from '../util/uploadAudioRecording'
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


    const [transcription, setTranscription] = useState('')
    const [summary, setSummary] = useState<string>('')
    const [relatedTags, setRelatedTags] = useState<string[] | null>(null)

    // Beta test 
    // const {
    //   audioBlob, 
    //   audioUrl, 
    //   is_recording, 
    //   startRecording, 
    //   stopRecording
    // } = useAudioRecording()
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
        console.log("Processing")
        // if (recordingBlob == null) return 
        if (recordingBlob == null) return 
        setLoading(true)
        convertWav(recordingBlob)
        .then((resp) => 
          uploadAudioRecording(resp)
            .then( (data) => { 
                
                if (data) {
  
                  router.push({
                      pathname: `/post_analysis/${data._id}`,
                      
                  })
                  resetRecordingStates()
                  setLoading(false)
                }
            })
        )
        .catch((error) => {
          setLoading(false)
          resetRecordingStates()
          throw new Error(error)
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