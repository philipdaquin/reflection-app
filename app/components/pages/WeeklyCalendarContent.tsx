import React, { useEffect, useState } from 'react'
import WeeklyCalendar from '../WeeklyCalendar'
import { getAllByDate } from '../../util/audio/getAllByDate'
import { AudioData, DailySummary, TextClassification, WeeklySummary } from '../../typings'
import DailyAudioEntries from '../moodWidgets/DailyAudioEntries'
import MoodInsightWidget from '../moodWidgets/MoodInsightWidget'
import MoodAnalysisChange from '../moodWidgets/MoodAnalysisChange'
import MoodActivityWidget from '../moodWidgets/MoodActivityWidget'
import { getWeeklyByDate } from '../../util/weekly/getWeeklyByDate'
import { fullTimeFormat } from '../../util/fullTimeFormat'
import { getWeekStartAndEndDates } from '../../util/getWeekStartandEndDate'
import MoodSummaryContents from './MoodSummaryContents'


interface WeeklyProps { 
  mood_graph: TextClassification[] | null,
  weekly_summary: WeeklySummary | null,
  selectedDate: Date
}

function WeeklyContent({mood_graph, weekly_summary, selectedDate}: WeeklyProps) { 
  
  const {startDate, endDate } = getWeekStartAndEndDates(selectedDate) 

  let start = fullTimeFormat(weekly_summary?.start_week?.toString() || startDate.toString())
  let end = fullTimeFormat(weekly_summary?.end_week?.toString() || endDate.toString())
  
  return (
    <>
      <div className=''>
        <h1 className='text-[25px] font-semibold'>
          Weekly Summary
        </h1>
        <h2 className='text-[#9e9e9e] text-[15px]'>
          {start} - {end}
        </h2>
      </div>
      <MoodSummaryContents 
        mood_graph={mood_graph}
        weekly_summary={weekly_summary}
      />
    </>
  )
}


interface DailyProps { 
  selectedDate: Date,
  selectedEntries: AudioData[] | null | undefined, 
  selectedAnalsysis: TextClassification[] | null | undefined,

}

function DailyContent({selectedDate, selectedEntries, selectedAnalsysis}: DailyProps) { 

  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(selectedDate);
  const year = selectedDate?.getFullYear();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currDay = selectedDate?.getDay() || 0
  const currDateNum = selectedDate.getDate()
  let day = daysOfWeek[currDay] 
  
  return (
    <>
      
      <div className='space-y-0'>
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
                <MoodInsightWidget  dailySummary={null} currentWeeklySummary={null} />  
                {/* <MoodTriggersWidget data={[]}/> */}
                <DailyAudioEntries entries={selectedEntries}/>
              </div>
            </div>
          )
        }
      </div>          
    </>
  )
}


interface Props { 
  recent_entries: AudioData[] | null,
  all_mood_data: TextClassification[] | null,
  dailyMoodSummary: DailySummary | null
}

function WeeklyCalendarContent( {
  recent_entries, 
  all_mood_data,
  dailyMoodSummary
}: Props) {
    const [selectedDate, setCurrDate] = useState<Date>(new Date())
    const [selectedAnalsysis, setselectedAnalsysis] = useState<TextClassification[] | null>()
    
    const [showWeekly, setShowWeekly] = useState('Daily')

    const [selectedEntries, setSelectedEntries] = useState<AudioData[] | null>()
    const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null)

    // Set to get the DailySummary which includes all relevant data 
    const entry = async (date: Date) => { 
        const entries = await getAllByDate(date)
        setSelectedEntries(entries)
    }
    // Toggle to show Daily or Weekly Sumamry 
    const getWeeklySummary = async (date: Date) => { 
      const summary = await getWeeklyByDate(date)
      setWeeklySummary(summary)
    }

    useEffect(() => {
        if (!selectedDate) return 
        entry(selectedDate)
        getWeeklySummary(selectedDate)
    }, [selectedDate])


    useEffect(() => {
      if (!selectedEntries) return 
      const textClassification: TextClassification[] | null | undefined  = selectedEntries?.map((item, i) => item.text_classification) || []
      setselectedAnalsysis(textClassification)
    }, [selectedEntries])

    

    return (

        <div className='w-full relative'>
          <WeeklyCalendar 
            setCurrDate={setCurrDate} 
            setShowWeekly={setShowWeekly}
            showWeekly={showWeekly}
          />
   
          <div className='pt-5'>
            <hr />
          </div>

          <section className='pt-[26px]'>
            { 
              showWeekly === 'Daily' ? 
                <DailyContent 
                  selectedDate={selectedDate}
                  selectedAnalsysis={selectedAnalsysis}
                  selectedEntries={selectedEntries}
                /> 
              : 
                <WeeklyContent 
                  mood_graph={all_mood_data} 
                  weekly_summary={weeklySummary}
                  selectedDate={selectedDate}
                />
            }
          </section>
          
        </div>
    )
}

export default WeeklyCalendarContent