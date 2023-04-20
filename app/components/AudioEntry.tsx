import { ObjectId } from 'bson'
import Image from 'next/image'
import React from 'react'

interface Props { 
    id: string,
    title: string | null, 
    duration: number | null
    thumbnailUrl: string | null | undefined
}

const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
function AudioEntry({id, title, duration, thumbnailUrl}: Props) {

  if (!thumbnailUrl) thumbnailUrl = IMAGE_URL


  return (
    <div className='flex flex-row justify-between items-center'>
        <div className='flex space-x-3'>
            <Image src={thumbnailUrl} 
              className='w-[61px] h-[61px] rounded-xl bg-[#d9d9d9]' 
              alt='User Profile'  
              height={61}
              width={61}
              quality={100}
            />  
            <h1 className='text-left font-medium relative top-2 text-[14px]'>
               {title}
            </h1>
        </div>
        <h3 className='text-sm text-left text-[12px]'>
            {duration} min
        </h3>
    </div>
  )
}

export default AudioEntry