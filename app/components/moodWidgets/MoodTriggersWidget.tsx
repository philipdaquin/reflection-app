import React, { useEffect, useState } from 'react'
import { DailySummary, MoodFrequency, MoodTriggerType, TextClassification, WeeklySummary } from '../../typings'
import {ChevronRightIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useRecoilState, useRecoilValue } from 'recoil'
import { MoodTriggerPage, SelectedFilterOption } from '../../atoms/atoms'


interface Props { 
    data: DailySummary | null,
    currentWeeklySummary: WeeklySummary | null

}


interface MoodTriggerProps { 
    entry: MoodFrequency
}

function MoodTriggerEntry({entry: {_audio_ids, count, emotion, emotion_emoji, percentage}}: MoodTriggerProps) { 
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#f5f5f5]  "

    return ( 
        <div className={`justify-between flex flex-row items-center w-full py-2  px-5 ${onHover}`}>
            <div className='flex flex-row justify-center items-center w-full space-x-2'>
                <div className={`text-xl p-2 rounded-full bg-[#f5f5f5] `}>
                    {emotion_emoji}
                </div>
                <div className='w-full space-y-1'>
                    <h1 className='text-sm text-left font-medium'>
                        {emotion}
                    </h1>
                    {count && count > 0 && (
                        <div className='items-center flex flex-row space-x-1'>
                            
                                <div className='bg-[#00a3ff] h-1 rounded-full w-full ' 
                                    style={{width: `${(count)}%`}}>
                                </div>

                            <p className='text-xs px-1 text-left items-start text-[#757575]'>{count}</p>
                        </div>
                    )}
                </div>
            </div>
            <ChevronRightIcon height={20} width={20} color='#9e9e9e'/>
        </div>
    )
}


function MoodTriggersWidget({data, currentWeeklySummary}: Props) {

    const router = useRouter()
    const [showToggle, setShowToggle] = useState(false)
    console.log(data)

    const [selectedData, selectedSetData] = useState<MoodFrequency[] | null | undefined>(data?.mood_frequency)

    const filteredData = showToggle ? selectedData : selectedData?.slice(0, 3)
    const openToggle = () => setShowToggle(true)

    const selectedFilter = useRecoilValue(SelectedFilterOption)


    // Sets the MoodTriggerType 
    const [showTrigger, setTrigger] = useRecoilState(MoodTriggerPage)
    const selectTrigger = (data: MoodFrequency) => setTrigger(data)
    
    useEffect(() => {
        if (selectedFilter.label === '24H') { 
            selectedSetData(data?.mood_frequency)
        } else { 
            selectedSetData(currentWeeklySummary?.mood_frequency)
        }


    }, [selectedFilter])
    

    return (
        <div className='widget_container px-0'>
            <div className='flex flex-row items-center justify-between px-5'>
                <div className='flex flex-col text-left space-y-1'>
                    <h1 className='text-[20px] font-medium'>
                        Mood Triggers
                    </h1>
                    <p className='text-[#757575] text-xs font-medium'>
                        Triggers that cause your mood
                    </p>
                </div>
                {
                    !showToggle && selectedData && selectedData?.length > 3 && (
                        <h1 onClick={openToggle} hidden={showToggle} className='text-[#2e9dfb] text-[13px] text-left font-regular hover:underline cursor-pointer'>
                            See All
                        </h1>
                    )
                }
                
            </div>

            <div className='space-y-3 pt-[20px] w-full'>
                {
                    filteredData?.map((item, i) => { 
                        return (
                            <div key={i}>
                                <Link href={`/trigger/${i}`} onClick={() => selectTrigger(item)}>
                                    <MoodTriggerEntry entry={item}/>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default MoodTriggersWidget