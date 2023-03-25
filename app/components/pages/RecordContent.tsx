import React from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TimerState, RecordingState } from '../../atoms/atoms'
import formatTime from '../../util/formatTime'
import AudioVisualizer from '../AudioVisualizer'
import BackButton from '../BackButton'
import GeneratePrompt from '../GeneratePrompt'
import LiveNotification from '../LiveNotification'
import UserChannel from '../UserChannel'


const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'


function RecordContent() {
    const recordingTimer = useRecoilValue(TimerState);
    const recordingState = useRecoilValue(RecordingState);
    let timer = formatTime(recordingTimer)
    return (
        <>  
            <div className='flex flex-row items-center justify-between'>
                <BackButton link='' />
                <h1 className='font-bold text-[15px] text-center '>Record Audio</h1>
                <div className='px-4 bg-black'></div>
            </div>
            
            <div className='flex flex-col justify-center items-center space-y-10 pt-10'>
                <GeneratePrompt />
                <UserChannel userImg={IMAGE_URL} userName='Username'/>
                {/* Timer  */}
            {/* Visualiser */}

                {recordingState && (
                    <div>
                        <div className=''>
                            <AudioVisualizer width={344} height={100} />
                        </div>
                            <div className='scale-x-[-1] rotate-180'>
                            <AudioVisualizer width={344} height={100} />
                        </div>
                    </div>
                )}
           
                <h2 className='text-base font-medium'>
                    {timer}
                </h2>
           
            </div>
            

           

        </>
    
    )
}
export default RecordContent