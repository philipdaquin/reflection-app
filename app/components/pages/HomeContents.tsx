import React from 'react'
import GreetingUser from '../GreetingUser'
import MoodTrackerIndex from '../MoodTrackerIndex'
import RecentEntries from '../RecentEntries'
import WeeklyRoundUpComp from '../WeeklyRoundUpComp'

function HomeContents() {
  return (
    <div className='bg-white md:w-full md:h-full w-full h-full rounded-[70px]'>
      <GreetingUser />
      <div className='mt-10'>
        <MoodTrackerIndex />
      </div>

      {/* Weekly roundups  */}
      <div className='pt-7'>
        <WeeklyRoundUpComp/>
      </div>
      {/* Recent entries  */}
      <div className='pt-11'>
        <RecentEntries />
      </div>
    </div>
  )
}

export default HomeContents