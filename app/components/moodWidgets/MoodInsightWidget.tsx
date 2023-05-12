import React, { useEffect, useState } from 'react'
import { AudioData, DailySummary, MoodFrequency, WeeklySummary } from '../../typings'
import { recentEntryTimeStamp } from '../../util/recentEntryTimeStamp'
import { fullTimeFormat } from '../../util/fullTimeFormat'
import { useRecoilValue } from 'recoil'
import { SelectedFilterOption } from '../../atoms/atoms'


interface Props {
    title: string 
    date: string 
}

export function InsightContainer({title, date}: Props) { 
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-xl "

    return (
        <div className={`widget_container space-y-2 ${onHover} cursor-pointer`}>
            <h2 className='text-left text-xs font-medium text-[#757575]'>{title}</h2>
            <h1 className='text-left text-[17px] md:text-sm font-semibold'>
                {date}
            </h1>
        </div>
    )
}


interface MoodProps { 
    dailySummary: DailySummary | null,
    currentWeeklySummary: WeeklySummary | null

}
function MoodInsightWidget({dailySummary, currentWeeklySummary}: MoodProps) {
    

    const selectedFilter = useRecoilValue(SelectedFilterOption)

    const [best, setBestData] = useState<AudioData | null | undefined>(currentWeeklySummary?.max)
    const [worst, setWorstData] = useState<AudioData | null | undefined>(currentWeeklySummary?.min)
    const [inflection, setInflectedData] = useState<AudioData | null | undefined>(currentWeeklySummary?.inflection)
    
    
    let f = currentWeeklySummary?.mood_frequency?.at(0)
    
    const [frequency, setDominantData] = useState<MoodFrequency | null | undefined>(f)

    // If 24hr then only show DailySummary
    // If 1W or more, then only show WeeklySummary
    useEffect(() => {
        if (selectedFilter.label === '24H') {
            setBestData(dailySummary?.max)
            setWorstData(dailySummary?.min)
            setInflectedData(dailySummary?.inflection)
            setDominantData(dailySummary?.mood_frequency[0])
        } else { 
            setBestData(currentWeeklySummary?.max)
            setWorstData(currentWeeklySummary?.min)
            setInflectedData(currentWeeklySummary?.inflection)
            setDominantData(currentWeeklySummary?.mood_frequency ? currentWeeklySummary?.mood_frequency[0] : null)
        }
    }, [selectedFilter])
    
    
    const bestTime =  fullTimeFormat(best?.date.toString() || "")
    const worstTime =  fullTimeFormat(worst?.date.toString() || "")
    const inflectionTime =  fullTimeFormat(inflection?.date.toString() || "")
    const percentage = ((frequency?.percentage ?? 0) as number).toFixed(2) 
    const fullPercentage = (frequency?.emotion_emoji || "NaN") + " " +   percentage + "%"


    return (
        <div className='flex flex-col space-y-4 '>
            <div className='flex space-x-4'>
                <InsightContainer date={`${best ? bestTime: 'NaN' }`} title='🏆 Best Day'/>
                <InsightContainer date={`${worst ? worstTime : 'NaN'}`} title='😖 Worst Day'/>
            </div>
            <div className='flex space-x-4'>
                <InsightContainer date={`${inflection ? inflectionTime : 'NaN'}`} title='😐 Change in Mood'/>
                <InsightContainer date={fullPercentage} title='💪 Dominant Mood'/>
            </div>
        </div>
    )
}

export default MoodInsightWidget