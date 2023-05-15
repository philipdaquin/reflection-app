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
import { getAnalysisByWeek } from '../../util/analysis/getAnalysisByWeek'
import { CurrentWeekSummary } from '../../atoms/atoms'
import { useRecoilState } from 'recoil'
import MoodSummaryWidget from '../moodWidgets/MoodSummaryWidget'
import { getDailyByDate } from '../../util/daily/getDailyByDate'
import MoodCompositionWidget from '../moodWidgets/MoodCompositionWidget'
import MoodTriggersWidget from '../moodWidgets/MoodTriggersWidget'
import { SelectedFilterOption } from '../../atoms/atoms'

interface WeeklyProps { 
  mood_graph: TextClassification[] | null,
  weekly_summary: WeeklySummary | null,
  selectedDate: Date
}

function WeeklyContent({mood_graph, weekly_summary, selectedDate}: WeeklyProps) { 
  return (
    <>
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
  selectedDaily: DailySummary | null,
  selectedWeekly: WeeklySummary | null
}

function DailyContent({selectedDate, selectedEntries, selectedAnalsysis, selectedDaily, selectedWeekly}: DailyProps) { 

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
                <MoodSummaryWidget 
                  dailyMoodSummary={selectedDaily} 
                  currentWeeklySummary={selectedWeekly}/>
                <MoodAnalysisChange all_mood_data={selectedAnalsysis} hideFilter={true}/>
                {/* <MoodCompositionWidget data={[]}/>  */}
                <MoodActivityWidget entries={selectedAnalsysis || []}/>
                <MoodInsightWidget  dailySummary={selectedDaily} currentWeeklySummary={selectedWeekly} />  
                {/* <MoodTriggersWidget data={selectedDaily} currentWeeklySummary={null}/> */}
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
    const [selectedAnalsysis, setselectedAnalsysis] = useState<TextClassification[] | null>(null)
    
    const [showWeekly, setShowWeekly] = useState('Daily')
    const [dailySummary, setDailySummary] = useState<DailySummary | null>(dailyMoodSummary)
    const [selectedEntries, setSelectedEntries] = useState<AudioData[] | null>(null)

    // const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null)
    const [weeklySummary, setWeeklySummary] = useRecoilState<WeeklySummary | null>(CurrentWeekSummary)
    // Set to get the DailySummary which includes all relevant data 
    const getDailySummary = async (date: Date) => { 
      const summary = await getDailyByDate(date)
      setDailySummary(summary)
    }
    const getDailyEntries = async (date: Date) => { 
        const entries = await getAllByDate(date)
        setSelectedEntries(entries)
    }

    const getWeeklyAnalysis = async (date: Date) => { 
      const weeklyAnalysis = await getAnalysisByWeek(date)
      setselectedAnalsysis(weeklyAnalysis)
    }

    // Toggle to show Daily or Weekly Sumamry 
    const getWeeklySummary = async (date: Date) => { 
      const summary = await getWeeklyByDate(date)
      setWeeklySummary(summary)
    }

    useEffect(() => {
   
      if (selectedDate && showWeekly === 'Daily') {
        getDailySummary(selectedDate)
        getDailyEntries(selectedDate)
        
      }
        getWeeklyAnalysis(selectedDate)
        getWeeklySummary(selectedDate)
    }, [showWeekly, selectedDate])

    const handleDateChange = (date: Date) => {
      setCurrDate(date)
    }

    // useEffect(() => {
    //   if (!selectedEntries) return 
    //   const textClassification: TextClassification[] | null | undefined  = selectedEntries?.map((item, i) => item.text_classification) || []
    //   setselectedAnalsysis(textClassification)
    // }, [selectedEntries])

    return (

        <div className='w-full relative'>
          <WeeklyCalendar 
            setCurrDate={handleDateChange } 
            setShowWeekly={setShowWeekly}
            showWeekly={showWeekly}
          />

          <div className='pt-5'>
            <hr />
          </div>

          <section className='pt-[26px]'>

              {
                showWeekly === 'Daily' ? (
                  <DailyContent 
                    selectedDate={selectedDate}
                    selectedAnalsysis={selectedAnalsysis}
                    selectedEntries={selectedEntries}
                    selectedDaily={dailySummary}
                    selectedWeekly={weeklySummary}
                  /> 
                ) : (
                  <WeeklyContent 
                      mood_graph={all_mood_data} 
                      weekly_summary={weeklySummary}
                      selectedDate={selectedDate}
                    />
                )
              }
          </section> 
          
        </div>
    )
}

export default WeeklyCalendarContent