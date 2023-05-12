import React, { useEffect, useState } from 'react'
import { DailySummary, MoodFrequency, WeeklySummary } from '../typings'
import changeInPercentage from '../util/changeInPercentage'
import { getDailyByDate } from '../util/daily/getDailyByDate'
import { getDate } from 'date-fns'
import { useRecoilValue } from 'recoil'
import { SelectedFilterOption } from '../atoms/atoms'
import { getWeeklyByDate } from '../util/weekly/getWeeklyByDate'

interface Props { 
    dailyMoodSummary: DailySummary | null,
    currentWeeklySummary: WeeklySummary | null,

}

function MoodSummary({dailyMoodSummary, currentWeeklySummary}: Props) {

    // console.log(dailyMoodSummary)
    // let emoji = dailyMoodSummary?.mood_frequency
    //     .find((item: MoodFrequency) => dailyMoodSummary?.overall_mood === item.emotion)?.emotion_emoji || ""

    const [pastDayDate, setPastDayDate] = useState<DailySummary | null>(null)
    const [currentDate, setCurrentDate] = useState<Date | null | undefined>(dailyMoodSummary?.date)

    const selectedFilter = useRecoilValue(SelectedFilterOption)
   
    // const [currentAvg, setCurrentAvg] = useState<number | null | undefined>(currentWeeklySummary?.weekly_avg)
    // const [currentMood, setCurrentMood] = useState<string | null | undefined>(currentWeeklySummary?.mood_frequency[0]?.emotion)
    // const [emotion_emoji, setEmotionEmoji] = useState<string | null | undefined>(currentWeeklySummary?.mood_frequency[0]?.emotion_emoji)
    const [currentAvg, setCurrentAvg] = useState<number | null | undefined>()
    const [currentMood, setCurrentMood] = useState<string | null | undefined>()
    const [emotion_emoji, setEmotionEmoji] = useState<string | null | undefined>()
    const [previousAvg, setPreviousAvg] = useState<number | null | undefined>()
    const [changePercent, setChangePercent] = useState<number | null>()


    // Get yesterdays data
    const pastDay = async (date: Date) => { 
        const past = await getDailyByDate(date)
        setPastDayDate(past || null)
    }
    

    const [previousWeek, setPreviousWeek] = useState<WeeklySummary | null>(null)
    const oneWeek = async (date: Date) => { 
        const lastWeek = await getWeeklyByDate(date)
        setPreviousWeek(lastWeek || null)
    }
    

    useEffect(() => {
        // if (selectedFilter.label === '24H') { 

            if (!dailyMoodSummary?.current_avg || !currentDate) return 
            setCurrentAvg(dailyMoodSummary?.current_avg)
            setCurrentMood(dailyMoodSummary?.overall_mood)

            let change = changeInPercentage(currentAvg || 0, previousAvg || 0) || 0

            setChangePercent(change)
            let inputDate = new Date(currentDate);
            inputDate.setDate(inputDate.getDate() - 1)
            pastDay(inputDate)

            setPreviousAvg(pastDayDate?.current_avg)
            setEmotionEmoji(dailyMoodSummary?.mood_frequency[0]?.emotion_emoji)


        // } else { 
            
        //     let inputDate = new Date()
        //     let oneWeekAgo = new Date(
        //         inputDate.getFullYear(), 
        //         inputDate.getMonth(), 
        //         inputDate.getDate() - inputDate.getDay() - 7)
            
        //     oneWeek(oneWeekAgo)
        //     setPreviousAvg(previousWeek?.weekly_avg)
        // }
    
    
    }, [selectedFilter, previousAvg, currentMood, currentAvg])
    

    // let changeInPercent = changeInPercentage(currentAvg || 0, previousAvg || 0)?.toFixed(2) || 0
    const sign = parseFloat(changePercent?.toString()!) 
    const colour = changePercent as number > 0 ? 
        "text-[#41d475] " 
    : changePercent as number < 0 ? 
        "text-[#E84040]" 

    : "text-[#757575] ";


    return (
        <div className='flex flex-row justify-between'>
            <div className='flex flex-col '>
                <h1 className='text-left font-semibold text-[21px]'>
                    {emotion_emoji || "NaN"} {currentMood || "NaN"}
                </h1>
                <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                    Overall Mood 
                </p>
            </div>

            <div className='flex flex-col'>
                <h1 className='text-left font-semibold text-[23px]'>
                    {currentAvg?.toFixed(2) || "0.00"} <span className='text-[15px]'>%</span>
                </h1>
                <p className='pt-[1px] text-left font-semibold text-xs text-[#757575]'>
                    Current Avg
                </p>
            </div>
            <div className='flex flex-col '>
                <h1 className={`text-left font-semibold text-[23px] ${colour}`}>
                    {changePercent?.toFixed(2) || "0.00" } <span className={`text-[15px] ${colour}`}>%</span>
                </h1>
                <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                    than Yesterday
                </p>
            </div>


        </div>
    )
}

export default MoodSummary