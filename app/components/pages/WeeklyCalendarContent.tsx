import React, { useEffect, useState } from 'react'
import WeeklyCalendar from '../WeeklyCalendar'
import { getAllByDate } from '../../util/audio/getAllByDate'
import { AudioData } from '../../typings'
import AudioEntry from '../AudioEntry'
import Link from 'next/link'

function WeeklyCalendarContent() {


    const [currDate, setCurrDate] = useState<Date>(new Date())
    const [selectedEntries, setSelectedEntries] = useState<AudioData[] | null>()
    
    const entry = async (data: Date) => { 
        const entries = await getAllByDate(data)
        setSelectedEntries(entries)
    }
    
    useEffect(() => {
        if (!currDate) return 
        entry(currDate)

    }, [currDate])

    console.log(selectedEntries)

    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currDate);
    const year = currDate?.getFullYear();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDay = currDate?.getDay() || 0
    let day = daysOfWeek[currDay] 
    
    return (

        <div className='w-full relative'>
          <WeeklyCalendar setCurrDate={setCurrDate} />
          
          {/* Temporary */}
          <div className='pt-5'>
            <hr />
          </div>
          
          <div className='pt-[26px] space-y-0'>
            <h1 className='text-[25px] font-semibold'>
              Daily Summary
            </h1>
            <h2 className='text-[#9e9e9e] text-[15px]'>
              {day}, {month} {year} 
            </h2>
          </div>
            

          <ul className='space-y-2'>
                {
                  selectedEntries?.map(({
                    _id, date, day, summary, tags, text_classification, title, transcription
                  }, k) => { 
                      return (
                        <li key={k}>
                          <Link href={{
                              pathname: `/play/${_id.toString()}`,
                              // query: { id: item.id }
                            }}>
                            <AudioEntry  
                                id= {_id}
                                title= {title}
                                duration={10} 
                                date={date.toString()} 
                                emotion={text_classification.emotion}
                                emoji={text_classification.emotion_emoji} 
                                average_mood={text_classification.average_mood}   
                                thumbnailUrl={""}
                            />
                                
                          </Link>
                        </li>
                      )
                  })
                }
          </ul>
        </div>
    )
}

export default WeeklyCalendarContent