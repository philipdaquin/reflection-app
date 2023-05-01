import React, { useEffect, useState } from 'react'
import WeeklyCalendar from '../WeeklyCalendar'
import { getAllByDate } from '../../util/audio/getAllByDate'
import { AudioData } from '../../typings'
import AudioEntry from '../AudioEntry'
import Link from 'next/link'

function WeeklyCalendarContent() {


    const [currDate, setCurrDate] = useState<Date | null>()
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

    const month = currDate?.getDate()

    return (
        <div className='w-full '>


        <WeeklyCalendar setCurrDate={setCurrDate} />
        <div>Entries</div>
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