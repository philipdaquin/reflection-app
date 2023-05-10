import React from 'react'
import MoodActivityChart from '../MoodActivityChart'
import { TextClassification } from '../../typings'

interface Props { 
  entries: TextClassification[] | null
}

function MoodActivityWidget({entries} : Props) {
  return (
    <div className='widget_container'>
      <h1 className='text-left font-medium text-[20px] '>
        Mood Activity 
      </h1>
      <div className='h-[200px] pt-[20px]'>
        <MoodActivityChart entries={entries}/>
      </div>
    </div>
  )
}

export default MoodActivityWidget