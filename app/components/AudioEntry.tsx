import React from 'react'

interface Props { 
    id: number,
    title: string,
    duration: number
    thumbnailUrl: string
}


function AudioEntry({id, title, duration, thumbnailUrl}: Props) {


  return (
    <div className='flex flex-row justify-between items-center'>
        <div className='flex space-x-3'>
            <div className="w-[61px] h-[61px] rounded-xl bg-[#d9d9d9]"></div>
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