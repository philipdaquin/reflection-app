import React from 'react'
import LineChart, { DataPoint } from './LineChart';
import { TextClassification } from '../typings';

const defaultDataPoint: DataPoint[] = [
  { date: "2022-01-01", mood: 0.1 },
  { date: "2022-01-02", mood: 0.0 },
  { date: "2022-01-03", mood: 0.0 },
  { date: "2022-01-04", mood: 0.0 },
  { date: "2022-01-05", mood: 0.0 },
  { date: "2022-01-06", mood: 0.0 },
  { date: "2022-01-07", mood: 0.0 },
  { date: "2023-03-20", mood: 0.0 },  
  { date: "2023-03-21", mood: 0.0 },  
  { date: "2023-03-22", mood: 0.0 },  
  { date: "2023-03-23", mood: 0.0 },  
  { date: "2023-03-24", mood: 0.0 },  
  { date: "2023-03-25", mood: 0.0 },  
  { date: "2023-03-26", mood: 0.0 }
];

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
  data: TextClassification[] | null
}

function MoodTrackerIndex({data}: Props) {
  console.log(data)

  let length = data?.length;

//@ts-ignore
let average: number | null | undefined = data?.reduce((total, item) => total + item.average_mood, 0) / length;
let avgString = (average ? (average * 100.0).toString().slice(0, 5) : '0');
let messageToUser = Emoji(average || 0) + " " + avgString + "%";

const dataPoint: DataPoint[] | null | undefined = data?.map((i) => new DataPoint(i)) || defaultDataPoint;

   


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
          <LineChart data={dataPoint}/>
        </div>
    </div>
  )
}

export default MoodTrackerIndex