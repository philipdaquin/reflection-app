import React, { useEffect, useState } from 'react'
import WeeklyCalendar from '../WeeklyCalendar'
import { getAllByDate } from '../../util/audio/getAllByDate'
import { AudioData, DailySummary, DefaultFilterOption, FilterOptions, TextClassification, WeeklySummary } from '../../typings'
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
import MoodFilter from '../MoodFilter'
import { getFilterOption } from '../moodWidgets/MoodAnalysisChange'

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
  const [, setFilter] = useRecoilState(SelectedFilterOption)
  const date = fullTimeFormat(selectedDate.toString(), true)

  // **Prevent unneccessary calls to the server 
  const analysis = selectedEntries?.map((item, i) => item.text_classification!  ) || []

  return (
    <>
      
      <div className='space-y-0'>
        <h1 className='text-[25px] font-semibold'>
          Daily Summary
        </h1>
        <h2 className='text-[#9e9e9e] text-[15px]'>
          {date}
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
                <MoodAnalysisChange all_mood_data={selectedAnalsysis}/>
                {/* <MoodCompositionWidget data={[]}/>  */}
                <MoodActivityWidget entries={analysis || []}/>
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
    const [selectedEntries, setSelectedEntries] = useState<AudioData[] | null>(recent_entries)

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

    // Track previous dates selected to prevent frequent server calls 
    const [lastSelectedDate, setLastSelectedDate] = useState<Date | null>(null);


    const [, setFilter] = useRecoilState(SelectedFilterOption)
    const selectFilter = (label: string) => { 
        const option = getFilterOption(label)
        setFilter(option)
    }
    
    
    useEffect(() => {
      const fetchAll = async() => { 
        if (selectedDate && selectedDate !== lastSelectedDate && showWeekly === 'Daily') {
          
          selectFilter('24H')
          
          await Promise.all([
            getDailySummary(selectedDate),
            getDailyEntries(selectedDate)
          ])
          setLastSelectedDate(selectedDate);

        }
        if (selectedDate && selectedDate !== lastSelectedDate)
          await Promise.all([
            getWeeklyAnalysis(selectedDate),
            getWeeklySummary(selectedDate)
          ])
          setLastSelectedDate(selectedDate);
      }
      fetchAll()
    }, [showWeekly, selectedDate, lastSelectedDate])

    const handleDateChange = (date: Date) => {
      setCurrDate(date)
    }

    // useEffect(() => {
    //   if (!selectedEntries) return 
    //   const textClassification: TextClassification[] | null | undefined  = selectedEntries?.map((item, i) => item.text_classification) || []
    //   setselectedAnalsysis(textClassification)
    // }, [selectedEntries])

    return (
      <section className='static'>
        <div className='fixed top-0 w-full left-0 right-0
            drop-shadow-sm py-5  shadow-sm  
            border-[#e0e0e0] 
            border-t-0 border-r-0 border-l-0 border-b-[1px] 
            
            bg-[#FEFEFE]
            z-10 
            sm:fixed 
            sm:top-0  
            md:absolute
            md:border-[16px] 
            md:border-[#FCFCFC] 
            
            md:rounded-t-[60px]
            md:border-b-0
            md:drop-shadow-none
            md:shadow-none
            ' >

          <WeeklyCalendar 
            setCurrDate={handleDateChange } 
            setShowWeekly={setShowWeekly}
            showWeekly={showWeekly}
          />
          <div className='hidden md:block z-10  border-[#e0e0e0] border-t-0 border-r-0 border-l-0 border-b-[1px] pt-3 relative top-5 
            shadow-sm drop-shadow-sm'></div>
        </div>
        <div className='w-full relative mt-40 '>
          
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
      </section>
    )
}

export default WeeklyCalendarContent