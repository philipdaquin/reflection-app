import React, { useState } from 'react'
import { TextClassification } from '../../typings'
import {ChevronRightIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'


interface Props { 
    data: TextClassification[] | null
}

type MoodTriggerType = { 
    id: string,
    title: string, 
    numOfEntries: number, 
    emoji: string
}

interface MoodTriggerProps { 
    entry: MoodTriggerType
}

function MoodTriggerEntry({entry: {id, emoji, numOfEntries, title}}: MoodTriggerProps) { 
    const [currentEntries, setCurrentEntry] = useState(0)

    return ( 
        <div className='justify-between flex flex-row items-center w-full'>
            <div className='flex flex-row justify-center items-center w-full space-x-2'>
                <div className='text-xl p-2 rounded-lg bg-[#f5f5f5]'>
                    {emoji}
                </div>
                <div className='w-full space-y-1'>
                    <h1 className='text-sm text-left font-medium'>
                        {title}
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

    // Mock data 
    const testData: MoodTriggerType[] = [
        {
          id: "1",
          title: "Exercise",
          numOfEntries: 10,
          emoji: "🏋️‍♀️"
        },
        {
          id: "2",
          title: "Meditation",
          numOfEntries: 7,
          emoji: "🧘‍♀️"
        },
        {
          id: "3",
          title: "Socializing",
          numOfEntries: 15,
          emoji: "👥"
        },
        {
          id: "4",
          title: "Music",
          numOfEntries: 5,
          emoji: "🎵"
        }
    ];

    const router = useRouter()

    return (
        <div className='widget_container'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-col text-left space-y-1'>
                    <h1 className='text-[20px] font-medium'>
                        Mood Triggers
                    </h1>
                    <p className='text-[#757575] text-xs font-medium'>
                        Triggers that cause your mood
                    </p>
                </div>
                <h1 onClick={() => router.push('')} className='text-[#2e9dfb] text-[13px] text-left font-regular hover:underline cursor-pointer'>
                    See All
                </h1>
            </div>

            <div className='space-y-5 pt-[20px]'>
                {
                    testData.map((item, i) => { 
                        return (
                            <div key={i}>
                                <Link href={`/${item.id}`}>
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