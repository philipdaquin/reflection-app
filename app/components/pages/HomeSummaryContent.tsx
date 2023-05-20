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
import { CurrentProgress, SelectedFilterOption } from '../../atoms/atoms';
import MoodFilter from '../MoodFilter';
import { toast } from 'react-hot-toast';
import { UploadProgress } from '../AddAudioFile';
import useUploadContext from '../../hooks/useUploadProgress';
import ProgressBar from '../notification/ProgressBar';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props { 
  all_mood_data: TextClassification[] | null
  recent_entries: AudioData[] | null,
  dailyMoodSummary: DailySummary | null,
  currentWeeklySummary: WeeklySummary | null,

}

function HomeSummaryContent({all_mood_data, recent_entries, dailyMoodSummary, currentWeeklySummary} : Props) {

  const currentDate = new Date()
  const fullday = fullTimeFormat(currentDate.toString(), true)

  // Weekly Variables 
  const {startDate, endDate } = getWeekStartAndEndDates(new Date()) 
  let start = fullTimeFormat(currentWeeklySummary?.start_week?.toString() || startDate.toString())
  let end = fullTimeFormat(currentWeeklySummary?.end_week?.toString() || endDate.toString())
  const fullweek = `${start} - ${end}`

  const selectedFilter = useRecoilValue(SelectedFilterOption)
  const dateRange = selectedFilter.label === '24H' ? fullday : fullweek

  // Inside your component
  // const handleShowToaster = () => {
    // toast.custom(() => (
    //   <div className='max-w-xl w-full h-20 bg-white shadow-lg rounded-lg
    //      pointer-events-auto flex ring-1 ring-black ring-opacity-5'>
    //   </div>
    // ), {
    //   duration: Infinity , // Set a duration in milliseconds (e.g., 5000ms = 5 seconds)
    //   // Other options...
    // });
  //   toast((t) => (
  //     <div className='
  //     flex flex-row justify-between items-center w-[200px] space-x-5 h-[45px] py-2'>
  //       <ProgressBar/>
  //       <button 
  //         //@ts-ignore
  //         onClick={() => toast.dismiss(t.id)} 
  //         className='cursor-pointer p-1 w-[20px] h-[20px] items-center flex justify-center bg-[#e0e0e0] rounded-full '>
  //           <XMarkIcon height={16} width={16} color="#757575" strokeWidth={3}/>
  //        </button>
  //     </div>
  //   ))
  // };
      

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
       {/* <button onClick={handleShowToaster}>Show Toaster</button> */}
      <h2 className='flex flex-row text-[15px] text-[#9e9e9e] font-regular'>{dateRange}</h2>

      <div className='pt-[30px] space-y-6 pb-52'>
        <MoodFilter />
        <MoodSummaryWidget dailyMoodSummary={dailyMoodSummary} currentWeeklySummary={currentWeeklySummary}/>
        <MoodAnalysisChange all_mood_data={all_mood_data} hideFilter/>
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