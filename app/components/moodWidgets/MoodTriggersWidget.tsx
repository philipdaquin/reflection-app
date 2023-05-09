import React, { useState } from 'react'
import { DailySummary, MoodTriggerType, TextClassification } from '../../typings'
import {ChevronRightIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'


interface Props { 
    data: DailySummary | null
}


interface MoodTriggerProps { 
    entry: MoodTriggerType
}

function MoodTriggerEntry({entry: {id, emoji, numOfEntries, emotion}}: MoodTriggerProps) { 
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#f5f5f5]  "

    return ( 
        <div className={`justify-between flex flex-row items-center w-full py-2  px-5 ${onHover}`}>
            <div className='flex flex-row justify-center items-center w-full space-x-2'>
                <div className={`text-xl p-2 rounded-full bg-[#f5f5f5] `}>
                    {emoji}
                </div>
                <div className='w-full space-y-1'>
                    <h1 className='text-sm text-left font-medium'>
                        {emotion}
                    </h1>
                    {numOfEntries > 0 && (
                        <div className='items-center flex flex-row space-x-1'>
                            
                                <div className='bg-[#00a3ff] h-1 rounded-full w-full ' 
                                    style={{width: `${(numOfEntries)}%`}}>
                                </div>

                            <p className='text-xs px-1 text-left items-start text-[#757575]'>{numOfEntries}</p>
                        </div>
                    )}
                </div>
            </div>
            <ChevronRightIcon height={20} width={20} color='#9e9e9e'/>
        </div>
    )
}


function MoodTriggersWidget({data}: Props) {

    const router = useRouter()
    const [showToggle, setShowToggle] = useState(false)
    console.log(data)
    const dataa: MoodTriggerType[] | undefined = data?.mood_frequency.map((item, i) => { 
        const s: MoodTriggerType = { 
            id: i + 1,
            emoji: item.emotion_emoji || "",
            numOfEntries: item.count || 0,
            emotion: item.emotion || ""
        }
        return s
    })

    const filteredData = showToggle ? dataa : dataa?.slice(0, 3)
    const openToggle = () => setShowToggle(true)

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
                    !showToggle && dataa && dataa?.length > 3 && (
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
                                <Link href={`/trigger/${item.id}`}>
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