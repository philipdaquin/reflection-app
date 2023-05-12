import React from 'react'
import BackButton from '../BackButton'
import GeneratePrompt from '../GeneratePrompt'
import LiveNotification from '../LiveNotification'
import UserChannel from '../UserChannel'
import { useRecoilValue } from 'recoil'
import { AudioUrl, RecordingState, TimerState } from '../../atoms/atoms'
import formatTime from '../../util/formatTime'
import AudioVisualizer from '../AudioVisualizer'

const IMAGE_URL: string = 'https://cdn.discordapp.com/attachments/995431514080813086/1071599764828864552/Airsickmammal_spaceman_anime_sketch_black_and_white_dust_a01891f7-6729-4f17-a718-568a23c9b76f.png'
const IMAGE_URL1: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'


function ChatContent() {
    const recordingTimer = useRecoilValue(TimerState);
    const recordingState = useRecoilValue(RecordingState);
    const audioSource = useRecoilValue(AudioUrl);
    let timer = formatTime(recordingTimer)
    return (
        <>  
            <div className='flex flex-row items-center justify-between'>
                <BackButton link=''/>
                <h1 className='font-bold text-sm text-center'>Conversations</h1>
                <LiveNotification />
            </div>
            <div className='flex flex-col justify-center items-center pt-10 space-y-2'>
                <div className='h-[80px]'>
                    <GeneratePrompt />

                </div>
                
                <div className='flex flex-row items-center w-full justify-between'>
                    <UserChannel userImg={IMAGE_URL} userName='AI'/>
                    <UserChannel userImg={IMAGE_URL1} userName='Username'/>
                </div>

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
               { audioSource && <audio controls hidden  autoPlay src={audioSource}></audio>}
            </div>
        </>
        
    )
}

export default ChatContent