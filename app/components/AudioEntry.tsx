import { ObjectId } from 'bson'
import Image from 'next/image'
import React from 'react'
import {ChevronRightIcon} from '@heroicons/react/24/outline'
import { recentEntryTimeStamp } from '../util/recentEntryTimeStamp'


interface Props { 
    id: string,
    title: string | null, 
    duration: number | null,
    date: string | null, 
    emotion: string | null,
    emoji: string | null,
    average_mood: number | null,
    thumbnailUrl: string | null | undefined
}

const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
function AudioEntry({
    id,
    title,
    date,
    duration,
    emotion,
    emoji,
    average_mood,
    thumbnailUrl
  
  }: Props) {

    if (!thumbnailUrl) thumbnailUrl = IMAGE_URL
    const adate =  recentEntryTimeStamp(date!)
    let avg = average_mood? average_mood * 10 : null

  return (
    <div className='w-full rounded-2xl bg-[#F5F5F5] h-full px-2 py-2'>
      <div className='items-center flex flex-row justify-between'>
        <div className='flex flex-row space-x-2 items-start'>
          <Image src={thumbnailUrl} 
              className='w-[61px] h-[61px] rounded-xl bg-[#d9d9d9]' 
              alt='User Profile'  
              height={61}
              width={61}
              quality={100}
            /> 
          <div className='text-left flex flex-col space-y-1'>
            <div>
              <p className='text-base font-medium'>{title}</p>
              <div className='flex flex-row space-x-2'>
                
                { date && (
                    <>
                      <p className='text-[11px] text-[#757575]'>{adate}</p>
                      <p className='text-[11px] text-[#757575]'>•</p>
                    </>
                  )
                }

                <p className='text-[11px] text-[#757575]'>{duration} min</p>
                
                {
                  emotion && (
                    <>
                      <p className='text-[11px] text-[#757575]'>•</p>
                      <p className='text-[11px] text-[#757575]'>{emotion}</p>
                    </>
                  )
                }
                
              </div>
            </div>

            <div className='flex w-fit space-x-1 items-center '>
              <p className='text-sm text-[#757575] font-medium'>{emoji} {avg} / 10</p>
            </div>
          </div>
        </div>
        <ChevronRightIcon height={20} width={20} color='#757575'/>
      </div>
    </div>  
  )


  // return (
  //   <div className='flex flex-row justify-between items-center'>
  //       <div className='flex space-x-3'>
  //           <Image src={thumbnailUrl} 
  //             className='w-[61px] h-[61px] rounded-xl bg-[#d9d9d9]' 
  //             alt='User Profile'  
  //             height={61}
  //             width={61}
  //             quality={100}
  //           />  
  //           <h1 className='text-left font-medium relative top-2 text-[14px]'>
  //              {title}
  //           </h1>
  //       </div>
  //       <h3 className='text-sm text-left text-[12px]'>
  //           {duration} min
  //       </h3>
  //   </div>
  // )
 
}

export default AudioEntry