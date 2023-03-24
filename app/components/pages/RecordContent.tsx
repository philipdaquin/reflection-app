import React from 'react'
import AudioVisualizer from '../AudioVisualizer'
import BackButton from '../BackButton'
import GeneratePrompt from '../GeneratePrompt'
import LiveNotification from '../LiveNotification'
import UserChannel from '../UserChannel'


const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'


function RecordContent() {
    return (
        <>  
            <div className='flex flex-row items-center justify-between'>
                <BackButton />
                <h1 className='font-bold text-[15px] text-center '>Record Audio</h1>
                <div className='px-4 bg-black'></div>
            </div>
            
            <div className='flex flex-col justify-center items-center pt-10 space-y-8'>
                <GeneratePrompt />
                <UserChannel userImg={IMAGE_URL} userName='Username'/>
            {/* Bottom  */}
            </div>
            <div className=''>
                <AudioVisualizer width={344} height={100} />
            </div>
            <div className='scale-x-[-1] rotate-180'>
                <AudioVisualizer width={344} height={100} />
            </div>

        </>
    
    )
}

export default RecordContent