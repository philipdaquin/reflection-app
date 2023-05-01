import React from 'react'

interface Props { 
    
}

function MoodSummary() {
  return (
    <div className='flex flex-row justify-between'>
        <div className='flex flex-col '>
            <h1 className='text-left font-semibold text-[21px]'>
                😆 Content
            </h1>
            <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                Overall Mood 
            </p>
        </div>

        <div className='flex flex-col'>
            <h1 className='text-left font-semibold text-[23px]'>
                32.2 <span className='text-[15px]'>%</span>
            </h1>
            <p className='pt-[1px] text-left font-semibold text-xs text-[#757575]'>
                Current Avg
            </p>
        </div>
        <div className='flex flex-col '>
            <h1 className='text-left font-semibold text-[23px] text-[#41d475]'>
                +10.2 <span className='text-[15px] text-[#41d475]'>%</span>
            </h1>
            <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                than Yesterday
            </p>
        </div>


    </div>
  )
}

export default MoodSummary