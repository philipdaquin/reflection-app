import React from 'react'
import GreetingUser from '../GreetingUser'
import MoodTrackerIndex from '../MoodTrackerIndex'
import RecentEntries from '../RecentEntries'
import WeeklyRoundUpComp from '../WeeklyRoundUpComp'
import { getServerSideProps } from '../../pages/post_analysis/[id]'
import { AudioEntryType, DEFAULT_RECENT_SAMPLES, TextClassification } from '../../typings'

interface Props { 
  data: TextClassification[] | null
}

function HomeContents({data}: Props) {
  
  return (
    <div className='bg-white md:w-full md:h-full w-full h-full rounded-[70px]'>
      <GreetingUser />
      <div className='mt-10'>
        <MoodTrackerIndex data={data}/>
      </div>

      {/* Weekly roundups  */}
      <div className='pt-7'>
        <WeeklyRoundUpComp/>
      </div>
      {/* Recent entries  */}
      <div className='pt-11'>
        <RecentEntries entries={DEFAULT_RECENT_SAMPLES} />
      </div>
    </div>
  )
}

export default HomeContents

