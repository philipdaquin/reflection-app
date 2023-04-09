import React from 'react'
import { CommonMoodData } from './MoodSummaryContents'
import { TopMood } from '../pages/mood_summary'


interface Props { 
    moodData: TopMood 
}
function CommonMoodContainer({moodData}: Props) {

    let percent = moodData.percentage?.toString().slice(0, 3) + "%"

    return (
        <div className='items-center flex flex-col justify-center mr-2 bg-[#fafafa] px-3 py-4 rounded-[20px]'>
            <h1 className='text-[25px] '>{moodData.emotion_emoji}</h1>
            <h2 className='text-[12px] text-[#424242] text-center'>{moodData.emotion}</h2>
            <h1 className='text-[25px] font-bold'>{percent}</h1>
        </div>
    )
}

export default CommonMoodContainer