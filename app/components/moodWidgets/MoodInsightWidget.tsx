import React, { useEffect, useState } from 'react'
import { AudioData, DailySummary, MoodFrequency, WeeklySummary } from '../../typings'
import { recentEntryTimeStamp } from '../../util/recentEntryTimeStamp'
import { fullTimeFormat } from '../../util/fullTimeFormat'
import { useRecoilValue } from 'recoil'
import { SelectedFilterOption } from '../../atoms/atoms'


interface Props {
    title: string 
    date: string | null
}

export function InsightContainer({title, date}: Props) { 
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-xl "

    return (
        <div className={`widget_container space-y-2 ${onHover} cursor-pointer`}>
            <h2 className='text-left text-xs font-medium text-[#757575]'>{title}</h2>
            <h1 className='text-left text-[17px] md:text-sm font-semibold'>
                {date || "NaN"}
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

    const [best, setBestData] = useState<AudioData | null | undefined>(null)
    const [worst, setWorstData] = useState<AudioData | null | undefined>(null)
    const [inflection, setInflectedData] = useState<AudioData | null | undefined>(null)

    const [frequency, setDominantData] = useState<MoodFrequency | null | undefined>(currentWeeklySummary?.mood_frequency?.at(0))



    const [bestTime, setBestTime] = useState<string | null>(null)
    const [worstTime, setWorstTime] = useState<string | null>(null)
    const [inflectionTime, setInflectionTime] = useState<string | null>(null)
    const [percentage, setPercentage] = useState<string | null>(null)
    const [fullPercentage, setFullPercentage] = useState<string | null>(null)

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
   
   
      
    }, [
        selectedFilter,
        dailySummary,
        currentWeeklySummary
    ])

    useEffect(() => {
        const bestTime_ =  fullTimeFormat(best?.date.toString() || "")
        const worstTime_ =  fullTimeFormat(worst?.date.toString() || "")
        const inflectionTime_ =  fullTimeFormat(inflection?.date.toString() || "")
        const percentage_ = ((frequency?.percentage ?? 0) as number).toFixed(2) 
        const fullPercentage_ = (frequency?.emotion_emoji || "NaN") + " " +   percentage + "%"

        setBestTime(bestTime_)
        setWorstTime(worstTime_)
        setInflectionTime(inflectionTime_)
        setPercentage(percentage_)
        setFullPercentage(fullPercentage_)

    }, [best,
        worst,
        inflection,
        frequency
    ])
    

    return (
        <div className='flex flex-col space-y-4 '>
            <div className='flex space-x-4'>
                <InsightContainer date={bestTime} title='🏆 Best Day'/>
                <InsightContainer date={worstTime} title='😖 Worst Day'/>
            </div>
            <div className='flex space-x-4'>
                <InsightContainer date={inflectionTime } title='😐 Change in Mood'/>
                <InsightContainer date={fullPercentage} title='💪 Dominant Mood'/>
            </div>
        </div>
    )
}

export default MoodInsightWidget