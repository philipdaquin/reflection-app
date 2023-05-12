import React from 'react'
import MoodSummary from '../MoodSummary'
import { DailySummary, WeeklySummary } from '../../typings'

interface Props { 
  dailyMoodSummary: DailySummary | null,
  currentWeeklySummary: WeeklySummary | null,

}

function MoodSummaryWidget({dailyMoodSummary, currentWeeklySummary}: Props) {
  return (
    <div className='widget_container'>
        <MoodSummary 
          dailyMoodSummary={dailyMoodSummary}
          currentWeeklySummary={currentWeeklySummary}
        />
    </div>
  )
}

export default MoodSummaryWidget