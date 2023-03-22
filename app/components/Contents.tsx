import React from 'react'
import GreetingUser from './GreetingUser'
import MoodTrackerIndex from './MoodTrackerIndex'
import WeeklyRoundUpComp from './WeeklyRoundUpComp'

function Contents() {
  return (
    <div>
      <GreetingUser />
      <div className='mt-10'>
        <MoodTrackerIndex />
      </div>

      {/* Weekly roundups  */}
      <div className='pt-7'>
        <WeeklyRoundUpComp/>
      </div>
      {/* Recent entries  */}
    </div>
  )
}

export default Contents