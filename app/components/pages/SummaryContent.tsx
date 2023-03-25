import React from 'react'
import AudioPlayer from '../AudioPlayer'
import BackButton from '../BackButton'
import JournalThumbnail from '../JournalThumbnail'

function SummaryContent() {
    return (
        <>
            <div className='flex flex-row items-center justify-between pb-5'>
                <BackButton link='record' />
                <h1 className='font-bold text-[15px] text-center '>Journal Entry Summary</h1>
                <div className='px-4 bg-black'></div>
            </div>

            <div className='flex flex-col items-center space-y-6'>
                <JournalThumbnail />
                <h1 className='text-[20px] font-bold text-center'>What's it like to lose a pet</h1>
            </div>

            {/* media player */}
            <AudioPlayer src='https://www.youtube.com/watch?v=cTH824WnA3U' />

            {/* Text summary */}

            {/* Suggested Tags */}

            {/* Button to save transcript to notes + summary*/}

            {/* Button:
                - Send to Ai 
                - Complete Check in
            */}



        </>


    )
}

export default SummaryContent