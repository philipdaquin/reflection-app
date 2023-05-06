import React from 'react'
import { AudioData, DailySummary, MoodFrequency } from '../../typings'
import { recentEntryTimeStamp } from '../../util/recentEntryTimeStamp'
import { fullTimeFormat } from '../../util/fullTimeFormat'


interface Props {
    title: string 
    date: string 
}

function InsightContainer({title, date}: Props) { 
    return (
        <div className='widget_container space-y-2'>
            <h2 className='text-left text-xs font-medium text-[#757575]'>{title}</h2>
            <h1 className='text-left text-[17px] font-semibold'>
                {date}
            </h1>
        </div>
    )
}


interface MoodProps { 
    dailySummary: DailySummary | null
}
function MoodInsightWidget({dailySummary}: MoodProps) {
    
    let best: AudioData | null | undefined = dailySummary?.max
    let worst: AudioData | null | undefined = dailySummary?.max
    let inflection: AudioData | null | undefined = dailySummary?.max
    let frequency: MoodFrequency | undefined = dailySummary?.mood_frequency[0]
    
    
    const bestTime =  fullTimeFormat(best?.date.toString() || "")
    const worstTime =  fullTimeFormat(worst?.date.toString() || "")
    const inflectionTime =  fullTimeFormat(inflection?.date.toString() || "")

    const percentage = frequency?.emotion_emoji + " " +  ((frequency?.percentage ?? 0) as number).toFixed(2) + "%"


    return (
        <div className='flex flex-col space-y-4 '>
            <div className='flex space-x-4'>
                { best && ( <InsightContainer date={bestTime} title='🏆 Best Day'/>)}
                { worst && (  <InsightContainer date={worstTime} title='😖 Worst Day'/>)}
            </div>
            <div className='flex space-x-4'>
               { inflection && ( <InsightContainer date={inflectionTime} title='😐 Change in Mood'/>)}
                <InsightContainer date={percentage} title='💪 Dominant Mood'/>
            </div>
        </div>
    )
}

export default MoodInsightWidget