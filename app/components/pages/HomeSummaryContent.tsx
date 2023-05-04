import React from 'react'
import MoodChart from '../moodWidgets/MoodAnalysisChange';
import { getMoodSummary } from '../../util/analysis/getMoodSummary';
import { GetServerSideProps } from 'next';
import { DEFAULT_IMAGE_URL, TextClassification } from '../../typings';
import MoodAnalysisChange from '../moodWidgets/MoodAnalysisChange';
import Image from 'next/image';
import MoodCompositionWidget from '../moodWidgets/MoodCompositionWidget';
import MoodInsightWidget from '../moodWidgets/MoodInsightWidget';
import MoodTriggersWidget from '../moodWidgets/MoodTriggersWidget';
import DailyAudioEntries from '../moodWidgets/DailyAudioEntries';
import MoodActivityWidget from '../moodWidgets/MoodActivityWidget';
import MoodSummary from '../MoodSummary';
import MoodSummaryWidget from '../moodWidgets/MoodSummaryWidget';

interface Props { 
  all_mood_data: TextClassification[] | null
}

function HomeSummaryContent({all_mood_data} : Props) {

  const currentDate = new Date()
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currDay = currentDate.getDay()
  
  let day = daysOfWeek[currDay]

  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
  const year = currentDate.getFullYear();


  return (
    <section className=''> 
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-left text-[25px] font-bold  '>Hello, John Apple!</h1>
          <h2 className='flex flex-row text-[15px] text-[#9e9e9e] font-regular'>{day}, {currDay} {month} {year}</h2>
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
      <div className='pt-[40px] space-y-6 pb-52'>
        <MoodSummaryWidget />
        <MoodAnalysisChange all_mood_data={all_mood_data} />
        {/* <MoodCompositionWidget data={[]}/> */}
        {/* <MoodActivityWidget entries={[]}/> */}
        <MoodInsightWidget />  
        <MoodTriggersWidget data={[]}/>
        <DailyAudioEntries entries={[]}/>
      </div>



    </section>
  )
}

export default HomeSummaryContent