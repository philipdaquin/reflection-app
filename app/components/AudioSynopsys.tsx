import React, { ChangeEvent } from 'react'

interface Props { 
  summary: string | null
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void; 
}

function AudioSynopsys({summary, onChange}: Props) {
  return (
    <div className='flex flex-col w-full '>
        <div className='text-left space-y-3'>
            <h1 className='text-md font-bold'>Summary</h1>
            <textarea className='text-[#424242] border-2 rounded-2xl bg-gray-100 p-2 w-full h-full text-[13px] outline-none' 
              onChange={onChange}
              style={{ minHeight: '80px' }} 
              value={summary || ''}
            />
        </div>
    </div>
  )
}

export default AudioSynopsys