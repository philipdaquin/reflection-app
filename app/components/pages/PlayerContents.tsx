import Image from 'next/image'
import React, { useState } from 'react'
import AudioMediaPlayer from '../AudioMediaPlayer'
import AudioPlayer from '../AudioPlayer'
import BackButton from '../BackButton'
import JournalThumbnail from '../JournalThumbnail'

import {ChevronDownIcon} from '@heroicons/react/24/solid'
import { AudioData, AudioEntryType, DEFAULT_IMAGE_URL } from '../../typings'
import AudioTranscripts from '../AudioTranscripts'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { MenuItem } from '../AudioEntry'


export const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'

interface Props { 
    src: string | null | undefined
}

export function ThumbnailPlayer({src}: Props) { 

    if (src === null || src === undefined) src = IMAGE_URL

    return (
    
    <div className='flex flex-col items-center space-y-4 rounded-[50px] shadow-md shadow-slate-200 border-4 border-[#FCFCFC]'>
         <Image src={src} 
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
    entry: AudioEntryType,
    data: AudioData

}

function PlayerContents({entry, data:{
    _id, 
    transcription, 
    date,
    title,
    text_classification
}}: PlayerContentProps) {


    const [toggleTranscript, setToggleTranscript] = useState(false)
    const showTranscript = () => { 
      setToggleTranscript(!toggleTranscript)
    }

    const currDate = new Date(date.toString())
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currDate);
    const day = currDate.getDate()
  
    const emotionEmoji = text_classification.emotion_emoji || "NaN" 
    const emotion = text_classification.emotion 
    const moodRating = text_classification.average_mood * 100 
    const emotionPercent = `${emotionEmoji} ${moodRating.toFixed(1) + "%"}`

    return (
        <section className='flex flex-col h-full  justify-between '>
            <div className='flex flex-row items-center justify-between pb-5'>
                <BackButton link='/'/>
                <h1 className='font-semibold text-[15px] text-end text-[#757575]'>Now Playing</h1>
                <MenuItem  id={_id} customClass='dropdown-bottom h-[42px] w-[42px] bg-[#212121] items-center flex justify-center'>
                    <EllipsisHorizontalIcon height={24} width={24} color='#fff'/>
                </MenuItem>
            </div>
            
            <div className=' w-full pt-20 md:pt-0'>
                <div className='flex flex-col items-center justify-center space-y-3 '>
                    <div className='flex justify-center'>
                        <ThumbnailPlayer src={DEFAULT_IMAGE_URL}/>
                    </div>
                    <div className='flex flex-col justify-center space-y-1 pt-2'>
                        <h1 className='text-[20px] font-bold text-center capitalize'>{title}</h1>
                        <div className=' flex flex-row  justify-beween text-center items-center  space-x-3 text-[14px] text-[#757575]'>
                        <p className=''>
                            {emotion}
                        </p>
                        <p>
                            •
                        </p>
                        <p>
                            {month} {day}
                        </p>
                        <p>
                            •
                        </p>
                        <p>
                            56 mins
                        </p>
                        </div>

                    </div>
                </div>
            </div>
            <div className='pt-44 md:pt-0 flex flex-col justify-center'>
                <div className="flex-grow"></div>

                <AudioMediaPlayer src={entry.audioUrl} />
                <div className=' flex flex-col space-y-3 pt-5'>
                    {/* media player */}
                    <div className='w-full' onClick={showTranscript}>
                        <ShowTranscript />
                    </div>
                    <div>
                    { 
                        toggleTranscript && (
                            <div>
                                <hr className='mt-4 pb-2' />
                                <p className='text-sm text-[#757575] pt-4'>
                                <AudioTranscripts text={transcription}/>
                                </p>
                            </div>
                        )   
                    }      
                    </div>
                </div>
            </div>
            
        </section>
    )
}

export default PlayerContents