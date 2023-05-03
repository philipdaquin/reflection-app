import React from 'react'
import { AudioData } from '../../typings'
import changeInPercentage from '../../util/changeInPercentage'
import { useRouter } from 'next/router'
import { recentEntryTimeStamp } from '../../util/recentEntryTimeStamp'


class EntryType { 
    id: string; 
    date: string;
    title: string; 
    emoji: string; 
    avgMood: number; 
    constructor(data: AudioData) {
        this.id = data._id
        this.date = data.date.toString()
        this.title = data.title || ""
        this.emoji = data.text_classification.emotion_emoji || ""
        this.avgMood = data.text_classification.average_mood
    }
}

interface EntryProps { 
    entry: EntryType
}

function AudioEntry({entry: {avgMood, date, emoji, id, title}}: EntryProps) {
    
    const adate =  recentEntryTimeStamp(date)

    const changeIn = changeInPercentage(avgMood)
    const changeNum = parseFloat(changeIn!)
    const sign = changeNum > 0 ? "+" : "";
    const formattedChangeIn = sign + changeNum.toFixed(2) + "%";

    const colour = changeNum > 0 ? 
        "text-[#1CC16A] bg-[#1CC16A]/20 " 
    : changeNum < 0 ? 
        "text-[#E84040] bg-[#E84040]/20" 

    : "text-[#757575] bg-[#757575]/20";
    
    
    return (
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center space-x-4'>
                <div className='p-2 bg-[#f5f5f5] rounded-full'> 
                    <h1 className='text-xl'>
                        {emoji}
                    </h1>
                </div>

                <div className='text-left'>
                    <h3 className='text-[10px] text-[#757575]'>
                        {adate} 
                    </h3>
                    <h1 className='font-medium text-sm'>
                        {title}
                    </h1>
                </div>
            </div>
            <div className={` ${colour} 
             text-[13px] font-semibold items-center text-center rounded-md px-2 py-1` }>
                {formattedChangeIn}
            </div>
        </div>
    )
}



interface Props { 
    entries: AudioData[] | null
}

function DailyAudioEntries({entries}: Props) {
    
    // % entry chg = (entry rating - current average) / current average * 100
    // 
    const testData: EntryType[] = [
        {
            id: "1",
            date: "2023-05-01T08:30:00Z",
            title: "Great day with friends",
            emoji: "🎉",
            avgMood: 0.96,
        },
        {
            id: "2",
            date: "2023-04-29T12:00:00Z",
            title: "Productive workday",
            emoji: "💪",
            avgMood: 0.84,
        },
        {
            id: "3",
            date: "2023-04-28T18:45:00Z",
            title: "Birthday celebration",
            emoji: "🎂",
            avgMood: 0.92,
        },
        {
            id: "4",
            date: "2023-04-27T10:15:00Z",
            title: "Long hike in the mountains",
            emoji: "⛰️",
            avgMood: 0.88,
        },
        {
            id: "5",
            date: "2023-04-26T14:30:00Z",
            title: "Lazy day at home",
            emoji: "🛋️",
            avgMood: 0.56,
        },
    ];

    // const data: EntryType[] | undefined = entries?.map((item, i) => new EntryType(item)) || testData

    const router = useRouter()  

    return (
        <div className='widget_container'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-col text-left space-y-1'>
                    <h1 className='text-[20px] font-medium'>
                        Audio Entries
                    </h1>
                </div>
                <div className='flex flex-col items-start space-y-2'>
                    <h1 onClick={() => router.push('')} className='text-[#2e9dfb] text-[13px] text-left font-regular hover:underline cursor-pointer'>
                        See All
                    </h1>
                </div>
            </div>
            <div className='flex flex-row-reverse pt-1'>
                <p className='text-[10px] text-[#757575]'>
                        Weekly Avg.
                </p>
            </div>

            <div className='space-y-5 pt-4'>
                {
                    testData.map((item, i) => { 
                        return (
                            <div key={i}>
                                <AudioEntry entry={item}/>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default DailyAudioEntries    