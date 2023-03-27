import Image from 'next/image'
import React from 'react'
import AudioMediaPlayer from '../AudioMediaPlayer'
import AudioPlayer from '../AudioPlayer'
import BackButton from '../BackButton'
import JournalThumbnail from '../JournalThumbnail'

import {ChevronDownIcon} from '@heroicons/react/24/solid'


const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'

function ThumbnailPlayer() { 
    return (
        <div className='flex flex-col items-center space-y-4 rounded-[50px] shadow-md shadow-slate-200 border-4 border-[#FCFCFC]'>
         <Image src={IMAGE_URL} 
              className='rounded-[50px] object-fill h-[192px] w-[192px]' 
              alt='User Profile'  
              height={192}
              width={192}
              quality={100}
          />  
    </div>
    )
}

function ShowTranscript() { 
    return (
        <div className='items-center flex flex-col justify-center space-y-2 cursor-pointer'>
            <h1 className='uppercase text-[#757575]  text-center text-sm'>Transcript</h1>
            <ChevronDownIcon height={20} width={20} color="#757575"/>
        </div>  
    )
}

interface PlayerContentProps { 
    id: string
}

function PlayerContents() {
  return (
    <section className='flex flex-col h-full justify-between'>
        <div className='flex flex-row items-center justify-between pb-5'>
            <BackButton link='' />
            <h1 className='font-semibold text-[15px] text-center text-[#757575]'>Now Playing</h1>
            <div className='px-4 bg-black'></div>
        </div>
        
        <div className=' w-full '>
            <div className='flex flex-col items-center space-y-[74px] pb-7'>
                <ThumbnailPlayer />
                <div className=''>
                    <h1 className='text-[20px] font-bold text-center'>What's it like to lose a pet</h1>
                    <div className='text-center justify-center items-center flex flex-row space-x-2 text-[#757575] text-[15px]'>
                        <h1>EP 2</h1>
                        <p>•</p>
                        <h1>March 30, 2023</h1>
                        <p>•</p>
                        <h1>56 mins</h1>
                    </div>
                </div>
            </div>
            {/* media player */}
            <AudioMediaPlayer src='https://www.youtube.com/watch?v=cTH824WnA3U' />
        </div>
        <ShowTranscript />
    </section>
  )
}

export default PlayerContents