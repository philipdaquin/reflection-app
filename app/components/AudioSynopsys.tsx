import React from 'react'

interface Props { 
  summary: string | null
  onChange: any;
}

function AudioSynopsys({summary, onChange}: Props) {
  return (
    <div className='flex flex-col w-full '>
        <div className='text-left space-y-3'>
            <h1 className='text-md font-bold'>Summary</h1>
           { summary && <textarea className='text-[#424242] border-2 rounded-lg p-2 w-full h-full text-[13px] outline-none' 
              onInput={onChange}
              style={{ minHeight: '80px' }} 
              value={summary}
            />}
        </div>
    </div>
  )
}

export default AudioSynopsys