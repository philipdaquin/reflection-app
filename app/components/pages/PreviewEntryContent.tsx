import React from 'react'
import { AudioData, DEFAULT_IMAGE_URL } from '../../typings'
import BackButton from '../BackButton'
import { ThumbnailPlayer } from './PlayerContents'
import { useRouter } from 'next/router'
import { PlayIcon } from '@heroicons/react/20/solid'

interface Props { 
    entry: AudioData | null
}

function PreviewEntryContent({entry }: Props) {
  
  const router = useRouter()

  return (
    <section className='flex flex-col h-full '>
      <div className='flex flex-row items-center justify-between pb-5'>
        <BackButton/>
        <h1 className='font-semibold text-[15px] text-center text-[#757575]'>Now Playing</h1>
        <div className='px-4 bg-black'></div>
      </div>
            
      <div className='w-full'>

        <div className='w-fit'>
          <ThumbnailPlayer src={DEFAULT_IMAGE_URL}/>
        </div>


        <div>
          <h1 className='font-semibold text-lg '>
            {entry?.title}
          </h1>
          <p className='text-sm text-[#757575]'>
          {entry?.summary}
          </p>
        </div>
        
      </div>
      

       <button onClick={() => router.push(`/play/${entry?._id}`)} className="items-center flex justify-center bg-[#eeeeee] rounded-full px-10 py-2 w-fit ">
          <PlayIcon height={25} width={25} color="#757575" />  
          <h1>Play</h1>
        </button>

    </section>

  )
}

export default PreviewEntryContent