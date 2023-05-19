import React, { ChangeEvent } from 'react'

interface Props { 
  description: string | null
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void; 
}

function AudioDescription({description, onChange}: Props) {
  return (
    <div className='flex flex-col w-full '>
        <div className='text-left space-y-3'>
            <h1 className='text-md font-bold'>Add Notes</h1>
            <textarea className='text-[#424242] border-2 rounded-2xl bg-gray-100 p-2 w-full h-full text-[13px] outline-none' 
              onChange={onChange}
              style={{ minHeight: '100px' }} 
              value={description || ''}
            />
        </div>
    </div>
  )
}

export default AudioDescription