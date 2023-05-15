import React, { useEffect, useState } from 'react'
import MoodChart from '../moodWidgets/MoodAnalysisChange';
import { getMoodSummary } from '../../util/analysis/getMoodSummary';
import { GetServerSideProps } from 'next';
import { AudioData, DEFAULT_IMAGE_URL, DailySummary, MoodFrequency, TextClassification, WeeklySummary } from '../../typings';
import MoodAnalysisChange from '../moodWidgets/MoodAnalysisChange';
import Image from 'next/image';
import MoodCompositionWidget from '../moodWidgets/MoodCompositionWidget';
import MoodInsightWidget from '../moodWidgets/MoodInsightWidget';
import MoodTriggersWidget from '../moodWidgets/MoodTriggersWidget';
import DailyAudioEntries from '../moodWidgets/DailyAudioEntries';
import MoodActivityWidget from '../moodWidgets/MoodActivityWidget';
import MoodSummary from '../MoodSummary';
import MoodSummaryWidget from '../moodWidgets/MoodSummaryWidget';
import { getCurrentWeeklySummary } from '../../util/weekly/getCurrentWeeklySummary';
import useLocalStorage from '../../hooks/useLocalStorage';
import { OPENAI_KEY } from '../SettingsButtons';
import { getWeekStartAndEndDates } from '../../util/getWeekStartandEndDate';
import { fullTimeFormat } from '../../util/fullTimeFormat';
import { useRecoilValue } from 'recoil';
import { SelectedFilterOption } from '../../atoms/atoms';

interface Props { 
  all_mood_data: TextClassification[] | null
  recent_entries: AudioData[] | null,
  dailyMoodSummary: DailySummary | null,
  currentWeeklySummary: WeeklySummary | null,

}

function HomeSummaryContent({all_mood_data, recent_entries, dailyMoodSummary, currentWeeklySummary} : Props) {

  const currentDate = new Date()
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currDay = currentDate.getDay()
  let day = daysOfWeek[currDay]
  const d = currentDate.getDate()
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
  const year = currentDate.getFullYear();
  const fullday = `${day}, ${d} ${month} ${year}`

  // Weekly Variables 
  const {startDate, endDate } = getWeekStartAndEndDates(new Date()) 
  let start = fullTimeFormat(currentWeeklySummary?.start_week?.toString() || startDate.toString())
  let end = fullTimeFormat(currentWeeklySummary?.end_week?.toString() || endDate.toString())
  const fullweek = `${start} - ${end}`

  const selectedFilter = useRecoilValue(SelectedFilterOption)
  const dateRange = selectedFilter.label === '24H' ? fullday : fullweek
  return (
    <section className=''> 
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-left font-bold text-[25px]'>Hello, John Apple!</h1>
        </div>  
        <Image src={DEFAULT_IMAGE_URL} 
                className='rounded-full object-fill w-[38px] h-[38px]' 
                alt='User Profile'  
                height={38}
                width={38}
                quality={100}
            />  
      </div>

      {/* Widget : Mood Changes */}
      {/* **Designed this way so each widget can be reused again */}
      {/* <h1 className='items-center flex  font-semibold text-[25px] text-black'>
        Summary
      </h1> */}
      <h2 className='flex flex-row text-[15px] text-[#9e9e9e] font-regular'>{dateRange}</h2>

      <div className='pt-[30px] space-y-6 pb-52'>
        <MoodSummaryWidget dailyMoodSummary={dailyMoodSummary} currentWeeklySummary={currentWeeklySummary}/>
        <MoodAnalysisChange all_mood_data={all_mood_data} />
        {/* <MoodCompositionWidget data={[]}/> */}
        {/* <MoodActivityWidget entries={[]}/> */}
        <MoodInsightWidget dailySummary={dailyMoodSummary} currentWeeklySummary={currentWeeklySummary}/>
        <MoodTriggersWidget data={dailyMoodSummary} currentWeeklySummary={currentWeeklySummary}/>
        <DailyAudioEntries entries={recent_entries}/>
      </div>



    </section>
  )
}

export default HomeSummaryContent