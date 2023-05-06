import React from 'react'
import { DailySummary } from '../typings'
import changeInPercentage from '../util/changeInPercentage'

interface Props { 
    dailyMoodSummary: DailySummary
}

function MoodSummary({dailyMoodSummary}: Props) {

     console.log(dailyMoodSummary)


  return (
    <div className='flex flex-row justify-between'>
        <div className='flex flex-col '>
            <h1 className='text-left font-semibold text-[21px]'>
                {dailyMoodSummary.overall_mood}
            </h1>
            <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                Overall Mood 
            </p>
        </div>

        <div className='flex flex-col'>
            <h1 className='text-left font-semibold text-[23px]'>
                {dailyMoodSummary.current_avg} <span className='text-[15px]'>%</span>
            </h1>
            <p className='pt-[1px] text-left font-semibold text-xs text-[#757575]'>
                Current Avg
            </p>
        </div>
        <div className='flex flex-col '>
            <h1 className='text-left font-semibold text-[23px] text-[#41d475]'>
                {changeInPercentage(dailyMoodSummary.current_avg || 0)} <span className='text-[15px] text-[#41d475]'>%</span>
            </h1>
            <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                than Yesterday
            </p>
        </div>


    </div>
  )
}

export default MoodSummary