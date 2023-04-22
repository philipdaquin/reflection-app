import React from 'react'
import GreetingUser from '../GreetingUser'
import MoodTrackerIndex from '../MoodTrackerIndex'
import RecentEntries from '../RecentEntries'
import WeeklyRoundUpComp from '../WeeklyRoundUpComp'
import { getServerSideProps } from '../../pages/post_analysis/[id]'
import { AudioData, AudioEntryType, DEFAULT_JOBLIST, TextClassification } from '../../typings'
import WeeklyCalendar from '../WeeklyCalendar'

interface Props { 
  mood_data: TextClassification[] | null,
  recent_entries: AudioData[] | null
}

function HomeContents({mood_data, recent_entries}: Props) {

  // AudioData to AudioDataEntry
  // const entries = recent_entries?.map((f) => new AudioEntryType(f) )

  return (
    <div className='bg-white md:w-full md:h-full w-full h-full rounded-[70px]'>
      <GreetingUser />
      <div className='mt-10'>
        <MoodTrackerIndex data={mood_data}/>
      </div>
      {/* Weekly roundups  */}
      
      {
        DEFAULT_JOBLIST && (
          <div className='pt-7'>
            <WeeklyRoundUpComp list={DEFAULT_JOBLIST}/>
          </div>
        )
      }
      
      {/* Recent entries  */}
      <div className='pt-11'>
          <RecentEntries entries={recent_entries} />
      </div>
    </div>
  )
}

export default HomeContents

