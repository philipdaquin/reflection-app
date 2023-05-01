import React from 'react'

function MoodTriggersWidget() {
  return (
    <div className='w-full rounded-[15px] border-[1px] border-[#e0e0e0] px-5 py-4'>
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col text-left space-y-1'>
                <h1 className='text-[15px] font-medium'>
                    Mood Triggers
                </h1>
                <p className='text-[#757575] text-xs font-medium'>
                    Triggers that cause your mood
                </p>
            </div>
            <h1 className='text-[#2e9dfb] text-[13px] text-left font-medium'>
                See All
            </h1>
        </div>
    </div>
  )
}

export default MoodTriggersWidget