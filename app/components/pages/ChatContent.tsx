import React from 'react'
import BackButton from '../BackButton'
import GeneratePrompt from '../GeneratePrompt'
import LiveNotification from '../LiveNotification'

function ChatContent() {

    return (
        <>  
            <div className='flex flex-row items-center justify-between'>
                <BackButton />
                <h1 className='font-bold text-sm text-center'>Conversations</h1>
                <LiveNotification />
            </div>
            <div className='flex flex-col justify-center items-center'>
                <GeneratePrompt />
            </div>
        </>
        
    )
}

export default ChatContent