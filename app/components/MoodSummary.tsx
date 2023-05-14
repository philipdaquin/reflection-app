import React, { useEffect, useMemo, useState } from 'react'
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

    const [pastDayDate, setPastDayDate] = useState<DailySummary | null>(null)
    const [currentDate, setCurrentDate] = useState<Date | null | undefined>(null)

    const selectedFilter = useRecoilValue(SelectedFilterOption)
   
    // const [currentAvg, setCurrentAvg] = useState<number | null | undefined>(currentWeeklySummary?.weekly_avg)
    // const [currentMood, setCurrentMood] = useState<string | null | undefined>(currentWeeklySummary?.mood_frequency[0]?.emotion)
    // const [emotion_emoji, setEmotionEmoji] = useState<string | null | undefined>(currentWeeklySummary?.mood_frequency[0]?.emotion_emoji)
    const [currentAvg, setCurrentAvg] = useState<number | null | undefined>(dailyMoodSummary?.current_avg)
    const [currentMood, setCurrentMood] = useState<string | null | undefined>(dailyMoodSummary?.overall_mood)
    const [emotion_emoji, setEmotionEmoji] = useState<string | null | undefined>(dailyMoodSummary?.mood_frequency[0]?.emotion_emoji)
    const [changePercent, setChangePercent] = useState<number | null>(null)
    
    const [previousAvg, setPreviousAvg] = useState<number | null | undefined>(null)

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

    //  Todo 
    //
    //
    useEffect(() => {
        // if (selectedFilter.label === '24H') {
            // if (!dailyMoodSummary?.date) return;
            setCurrentAvg(dailyMoodSummary?.current_avg);
            setCurrentMood(dailyMoodSummary?.overall_mood);
            setEmotionEmoji(dailyMoodSummary?.mood_frequency[0]?.emotion_emoji);
        
            setPreviousAvg(dailyMoodSummary?.previous_avg);
        
            let changeInPercent = changeInPercentage(dailyMoodSummary?.current_avg || 0, dailyMoodSummary?.previous_avg || 0) || 0;
            setChangePercent(changeInPercent);

        // } else { 
        //     let inputDate = new Date()
        //     let oneWeekAgo = new Date(
        //         inputDate.getFullYear(), 
        //         inputDate.getMonth(), 
        //         inputDate.getDate() - inputDate.getDay() - 7)
            
        //     oneWeek(oneWeekAgo)
        //     setPreviousAvg(previousWeek?.weekly_avg)
        // }
    
    }, [selectedFilter, dailyMoodSummary, currentWeeklySummary])

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
                    {previousAvg?.toFixed(2) || "0.00" } <span className={`text-[15px] ${colour}`}>%</span>
                </h1>
                <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                    than Yesterday
                </p>
            </div>


        </div>
    )
}

export default MoodSummary