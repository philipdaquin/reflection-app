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
                fetch("http://localhost:4001/api/upload", {
                method: "POST",
                body: formData,
              })
              .then(async (response) => {
                  if (response.ok) {
                      const url = URL.createObjectURL(recordingBlob)
                      const data = await response.text()

                      console.log(url)
                      setAudioURL(url)

                      return data
                  } else { 
                    throw new Error("Failed to get audio file")
                  }
              }) 
              .then(async (data) => { 
                setTranscription(data)

                const [summary, tags] = await Promise.all([
                  getTextSummary(data), 
                  getRelatedTags(data)
                ])

                setSummary(summary)
                setRelatedTags(tags)

                const pageData = {
                    transcript: transcription,
                    orginalAudio: audioURL,
                    summary: summary,
                    tags: tags
                }

                router.push({
                    pathname: '/post_analysis',
                    query: {
                      data: JSON.stringify(pageData)
                    }
                })
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

    const getTags = async () => { 
        const as = await getRelatedTags(transcription)
        setRelatedTags(as)
    }
    useEffect(() => { 
        if (transcription == null) return   
        getTags()
    }, [transcription])
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