import React from 'react'

function MoodTrackerIndex() {
  return (
    <div className='flex justify-between items-center'>
        <div className='flex flex-col space-y-2'>
            <div className='text-4xl font-bold text-left relative right-2 text-[#424242] '>
                😆 80.2 %
            </div>
            <div className='font-bold text-[14px] text-[#757575]'>
                Current Mood Index
            </div>
        </div>
        <div className='w-[92px] h-[42px] bg-green-400'>
                {/* Insert a graph here */}
        </div>
    </div>
  )
}

export default MoodTrackerIndex