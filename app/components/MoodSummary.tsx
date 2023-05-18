import React, { useEffect, useMemo, useState } from 'react'
import { DailySummary, MoodFrequency, WeeklySummary } from '../typings'
import changeInPercentage from '../util/changeInPercentage'
import { getDailyByDate } from '../util/daily/getDailyByDate'
import { getDate } from 'date-fns'
import { useRecoilValue } from 'recoil'
import { SelectedFilterOption } from '../atoms/atoms'
import { getWeeklyByDate } from '../util/weekly/getWeeklyByDate'
import { Emoji } from './MoodTrackerIndex'

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
    const [currentAvg, setCurrentAvg] = useState<number | null | undefined>(dailyMoodSummary?.current_avg || 0)
    const [currentMood, setCurrentMood] = useState<string | null | undefined>(dailyMoodSummary?.overall_mood || "NaN")
    const [emotion_emoji, setEmotionEmoji] = useState<string | null | undefined>(
        dailyMoodSummary?.mood_frequency && dailyMoodSummary.mood_frequency.length > 0
          ? dailyMoodSummary.mood_frequency[0]?.emotion_emoji
          : "NaN"
      );
    
    const [previousAvg, setPreviousAvg] = useState<number | null | undefined>(null)

    useEffect(() => {

        // Show current day's data 
        if (selectedFilter.label === '24H') {
            setCurrentAvg(dailyMoodSummary?.current_avg || 0);
            setCurrentMood(dailyMoodSummary?.overall_mood || "NaN");

            const emoji = Emoji(currentAvg || 0 )

            setEmotionEmoji(emoji);
            setPreviousAvg(dailyMoodSummary?.previous_avg);

        } else { 
            // Show current week's data 
            setCurrentAvg(currentWeeklySummary?.weekly_avg);

            const mood =  currentWeeklySummary?.mood_frequency && currentWeeklySummary.mood_frequency.length > 0
                        ? currentWeeklySummary.mood_frequency[0]?.emotion : "NaN"

            setCurrentMood(mood);

            const emoji = Emoji(currentWeeklySummary?.weekly_avg || 0 )

            setEmotionEmoji(emoji);
            setPreviousAvg(currentWeeklySummary?.previous_avg || 0)
           
        }
    
    }, [selectedFilter, dailyMoodSummary, currentWeeklySummary])

    let changeInPercent = changeInPercentage(currentAvg || 0, previousAvg || 0)?.toFixed(2) || 0
    const colour = changeInPercent as number > 0 ? 
        "text-[#41d475] " 
    : changeInPercent as number < 0 ? 
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
                    {((currentAvg || 0) * 100).toFixed(2) || "0.00"} <span className='text-[15px]'>%</span>
                </h1>
                <p className='pt-[1px] text-left font-semibold text-xs text-[#757575]'>
                    {
                        selectedFilter.label === '24H' ? ('Daily Avg') : ('Weekly Avg')
                    }
                </p>
            </div>
            <div className='flex flex-col '>
                <h1 className={`text-left font-semibold text-[23px] ${colour}`}>
                    {changeInPercent || "0.00" } <span className={`text-[15px] ${colour}`}>%</span>
                </h1>
                <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                    {
                        selectedFilter.label === '24H' ? ('Than yesterday') : ('Than last week')
                    }               
                </p>
            </div>


        </div>
    )
}

export default MoodSummary