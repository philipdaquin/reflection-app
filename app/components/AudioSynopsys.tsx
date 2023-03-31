import React from 'react'

interface Props { 
  summary: string
}

function AudioSynopsys({summary}: Props) {
  return (
    <div className='flex flex-col w-full'>
        <div className='text-left'>
            <h1 className='text-[15px] font-bold'>Summary</h1>
            <p className='text-[#424242]  text-[14px]'>{summary}</p>
        </div>
    </div>
  )
}

export default AudioSynopsys