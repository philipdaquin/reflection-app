import React, { useEffect, useState } from 'react'
import { DailySummary, MoodFrequency } from '../typings'
import changeInPercentage from '../util/changeInPercentage'
import { getDailyByDate } from '../util/daily/getDailyByDate'
import { getDate } from 'date-fns'

interface Props { 
    dailyMoodSummary: DailySummary | null
}

function MoodSummary({dailyMoodSummary}: Props) {

    console.log(dailyMoodSummary)
    let emoji = dailyMoodSummary?.mood_frequency
        .find((item: MoodFrequency) => dailyMoodSummary?.overall_mood === item.emotion)?.emotion_emoji || ""

    const [pastDayDate, setPastDayDate] = useState<DailySummary | null>(null)
    const [currentDate, setCurrentDate] = useState<Date | null | undefined>(dailyMoodSummary?.date)
    // Get yesterdays data
    const pastDay = async (date: Date) => { 
        const past = await getDailyByDate(date)
        setPastDayDate(past || null)
    }
    
    useEffect(() => {
        if (!dailyMoodSummary?.current_avg || !currentDate) return 
        
        let inputDate = new Date(currentDate);
        inputDate.setDate(inputDate.getDate() - 1)
        console.log(inputDate)

        pastDay(inputDate)
    
    }, [dailyMoodSummary, currentDate])
    

    let changeInPercent = changeInPercentage(dailyMoodSummary?.current_avg || 0, pastDayDate?.current_avg || 0)?.toFixed(2) || 0
    const sign = parseFloat(changeInPercent.toString()) 
    const colour = changeInPercent as number > 0 ? 
        "text-[#41d475] " 
    : changeInPercent as number < 0 ? 
        "text-[#E84040]" 

    : "text-[#757575] ";


    return (
        <div className='flex flex-row justify-between'>
            <div className='flex flex-col '>
                <h1 className='text-left font-semibold text-[21px]'>
                    {emoji} {dailyMoodSummary?.overall_mood || "NaN"}
                </h1>
                <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                    Overall Mood 
                </p>
            </div>

            <div className='flex flex-col'>
                <h1 className='text-left font-semibold text-[23px]'>
                    {dailyMoodSummary?.current_avg?.toFixed(2) || "0.00"} <span className='text-[15px]'>%</span>
                </h1>
                <p className='pt-[1px] text-left font-semibold text-xs text-[#757575]'>
                    Current Avg
                </p>
            </div>
            <div className='flex flex-col '>
                <h1 className={`text-left font-semibold text-[23px] ${colour}`}>
                    {changeInPercent || "0.00" } <span className={`text-[15px] ${colour}`}>%</span>
                </h1>
                <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                    than Yesterday
                </p>
            </div>


        </div>
    )
}

export default MoodSummary