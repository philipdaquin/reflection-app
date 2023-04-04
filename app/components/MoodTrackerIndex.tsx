import React from 'react'
import LineChart, { DataPoint } from './LineChart';
import { TextClassification } from '../pages';


function Emoji(average: number): string { 
  let emoji = ""
  if (average <= 2) {
    emoji = "😔";
  } else if (average <= 4) {
    emoji = "😕";
  } else if (average <= 6) {
    emoji = "😐";
  } else if (average <= 8) {
    emoji = "🙂";
  } else {
    emoji = "😊";
  }
  return emoji
}

interface Props { 
  data: TextClassification[]
}

function MoodTrackerIndex({data}: Props) {
  console.log(data)

  let length = data?.length

  let average = data?.reduce((total, item) => total + item.average_mood, 0) / length;
  let avgString = (average * 100.0).toString().slice(0, 5)
  let messageToUser = Emoji(average) + " " + avgString + "%"


  const dataPoint: DataPoint[] = data?.map((i) => new DataPoint(i))

  return (
    <div className='flex justify-between items-center'>
        <div className='flex flex-col space-y-2'>
            <div className='text-4xl font-bold text-left relative right-2 text-[#424242] '>
                {messageToUser}
            </div>
            <div className='font-bold text-[14px] text-[#757575]'>
                Current Mood Index
            </div>
        </div>
        <div className='w-[92px] h-[42px]'>
            {/* Insert a graph here */}
            <LineChart data={dataPoint} />
        </div>
    </div>
  )
}

export default MoodTrackerIndex