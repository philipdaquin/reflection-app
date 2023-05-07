import React, { useEffect, useState } from 'react'
import WeeklyCalendar from '../WeeklyCalendar'
import { getAllByDate } from '../../util/audio/getAllByDate'
import { AudioData, TextClassification } from '../../typings'
import AudioEntry from '../AudioEntry'
import Link from 'next/link'
import DailyAudioEntries from '../moodWidgets/DailyAudioEntries'
import MoodTriggersWidget from '../moodWidgets/MoodTriggersWidget'
import MoodInsightWidget from '../moodWidgets/MoodInsightWidget'
import MoodAnalysisChange from '../moodWidgets/MoodAnalysisChange'
import MoodActivityWidget from '../moodWidgets/MoodActivityWidget'
import MoodCompositionWidget from '../moodWidgets/MoodCompositionWidget'
import { getAll } from '../../util/audio/getAll'


interface Props { 
  
}

function WeeklyCalendarContent() {


    const [currDate, setCurrDate] = useState<Date>(new Date())
    const [selectedEntries, setSelectedEntries] = useState<AudioData[] | null>()
    const [selectedAnalsysis, setselectedAnalsysis] = useState<TextClassification[] | null>()

    // Set to get the DailySummary which includes all relevant data 
    const entry = async (date: Date) => { 
        // const entries = await getAll()
        const entries = await getAllByDate(date)
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
    const currDateNum = currDate.getDate()
    let day = daysOfWeek[currDay] 
    
    useEffect(() => {
      if (!selectedEntries) return 

      const textClassification: TextClassification[] | null | undefined  = selectedEntries?.map((item, i) => item.text_classification) || []
      setselectedAnalsysis(textClassification)

    }, [selectedEntries])
    

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
              {day}, {currDateNum} {month} {year} 
            </h2>
          </div>
            
          <div>
            {
              selectedEntries && (
                <div className='pt-10  pb-52'>
                  <div className=' space-y-6'>
                    <MoodAnalysisChange all_mood_data={selectedAnalsysis} />
                    {/* <MoodCompositionWidget data={[]}/>  */}
                    <MoodActivityWidget entries={[]}/>
                    <MoodInsightWidget  dailySummary={null} />  
                    {/* <MoodTriggersWidget data={[]}/> */}
                    <DailyAudioEntries entries={selectedEntries}/>
                  </div>


                  {/* <ul className='space-y-2'>
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
                  </ul> */}
                </div>
              )
            }
          </div>
          
        </div>
    )
}

export default WeeklyCalendarContent