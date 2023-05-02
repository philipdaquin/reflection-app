import React from 'react'
import { TextClassification } from '../../typings'
import MoodCompositionChart from '../MoodCompositionChart'

interface Props { 
    data: TextClassification[] | null
}

function MoodCompositionWidget({data} : Props) {
  return (
    <div className='w-full min-h-fit px-5 py-4 rounded-[15px] border-[1px] border-[#e0e0e0] bg-white drop-shadow-sm'>
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