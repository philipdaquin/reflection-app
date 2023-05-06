import React from 'react'
import MoodSummary from '../MoodSummary'
import { DailySummary } from '../../typings'

interface Props { 
  dailyMoodSummary: DailySummary
}

function MoodSummaryWidget({dailyMoodSummary}: Props) {
  return (
    <div className='widget_container'>
        <MoodSummary dailyMoodSummary={dailyMoodSummary}/>
    </div>
  )
}

export default MoodSummaryWidget