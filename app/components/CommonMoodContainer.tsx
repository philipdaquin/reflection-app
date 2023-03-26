import React from 'react'
import { CommonMoodData } from './MoodSummaryContents'


interface Props { 
    moodData: CommonMoodData
}
function CommonMoodContainer({moodData}: Props) {



    return (
        <div className='items-center flex flex-col justify-center mr-2 bg-[#fafafa] px-5 py-4 w-fit rounded-[20px]'>
            <h1 className='text-[30px] '>{moodData.emoji}</h1>
            <h2 className='text-sm text-[#424242] text-center'>{moodData.emotion}</h2>
            <h1 className='text-[30px] font-bold'>{moodData.avgSize * 10 + "%"}</h1>
        </div>
    )
}

export default CommonMoodContainer