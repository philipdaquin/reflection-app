import React, { useEffect, useState } from 'react'
import { AudioData, EntryType, WeeklySummary } from '../../typings'
import changeInPercentage from '../../util/changeInPercentage'
import { useRouter } from 'next/router'
import { recentEntryTimeStamp } from '../../util/recentEntryTimeStamp'
import { getWeeklySummary } from '../../util/weekly/getWeeklySummary'
import { getCurrentWeeklySummary } from '../../util/weekly/getCurrentWeeklySummary'
import { useRecoilValue } from 'recoil'
import { CurrentWeekSummary } from '../../atoms/atoms'
import Link from 'next/link'



interface EntryProps { 
    entry: EntryType,
    currentWeek: WeeklySummary | null
}

function AudioEntry({entry: {avgMood, date, emoji, id, title}, currentWeek}: EntryProps) {
    
    const adate =  recentEntryTimeStamp(date)
    
    const changeIn = changeInPercentage(avgMood, currentWeek?.weekly_avg || 0) || 0
    console.log("112", changeIn, currentWeek?.weekly_avg, currentWeek)
    const changeNum = parseFloat(changeIn.toString())
    const sign = changeNum > 0 ? "+" : "";
    const formattedChangeIn = sign + changeNum.toFixed(2) + "%";


    const colour = changeNum > 0 ? 
        "text-[#1CC16A] bg-[#1CC16A]/20 " 
    
    : changeNum < 0 ? 
        "text-[#E84040] bg-[#E84040]/20" 

    : "text-[#757575] bg-[#757575]/20";
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#f5f5f5] "

    
    return (
        <div className={`flex flex-row items-center justify-between py-2  px-5 ${onHover}`}>
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
                        {title.slice(0, 30) + "..."}
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
    const data: EntryType[] | undefined = entries?.map((item, i) => new EntryType(item)) || [] 
    // @ts-ignore
    data.sort((a, b) => new Date(b.date.toString()) - new Date(a.date.toString()))

    const router = useRouter()  

    // Temporary 
    const currentWeek = useRecoilValue<WeeklySummary | null>(CurrentWeekSummary)

    const currentDate = new Date()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDay = currentDate.getDay()
    
    let day = daysOfWeek[currDay]

    const d = currentDate.getDate()

    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    const year = currentDate.getFullYear();


    return (
        <div className='widget_container px-0'>
            <div className='flex flex-row items-center justify-between px-5'>
                <div className='flex flex-col text-left space-y-1'>
                    <h1 className='text-[20px] font-medium'>
                        Audio Entries
                    </h1>
                </div>
                <div className='flex flex-col items-start space-y-2'>
                    <h1 onClick={() => router.push('/see_all')} className='text-[#2e9dfb] text-[13px] text-left font-regular hover:underline cursor-pointer'>
                        See All
                    </h1>
                </div>
            </div>
            <div className='flex flex-row pt-1 justify-between items-center px-5'>
                <h2 className='flex flex-row text-[13px] text-[#757575] font-regular'>{day}, {d} {month} {year}</h2>
                <p className='text-[10px] text-[#757575]'>
                        vs. Weekly Avg.
                </p>

            </div>

            <div className='space-y-3 pt-4'>
                {
                    data.map((item, i) => { 
                        return (
                            <div key={i}>
                                <Link href={`/preview/${item.id}`}>
                                    <AudioEntry entry={item} currentWeek={currentWeek}/>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default DailyAudioEntries    