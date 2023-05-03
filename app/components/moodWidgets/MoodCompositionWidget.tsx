import React from 'react'
import { TextClassification } from '../../typings'
import MoodCompositionChart from '../MoodCompositionChart'

interface Props { 
    data: TextClassification[] | null
}

function MoodCompositionWidget({data} : Props) {
  return (
    <div className='widget_container'>
        <h1 className='text-left font-medium text-[20px] '>
            Mood Composition 
        </h1>

        {
          data && (
            <div className='h-[200px] pt-[20px]'>
                <MoodCompositionChart entries={data} />
            </div>
          )
        }

    </div>
  )
}

export default MoodCompositionWidget