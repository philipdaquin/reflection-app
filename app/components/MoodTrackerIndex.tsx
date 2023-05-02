import React, { useEffect } from 'react'
import LineChart, { DataPoint } from './LineChart';
import { TextClassification } from '../typings';
import { useRecoilState } from 'recoil';
import { AverageWeeklyIndex } from '../atoms/atoms';

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

export function Emoji(average: number): string { 
  let emoji = ""
  if (average <= 0.2) {
    emoji = "😔";
  } else if (average <= 0.4) {
    emoji = "😕";
  } else if (average <= 0.6) {
    emoji = "😐";
  } else if (average <= 0.8) {
    emoji = "🙂";
  } else {
    emoji = "😊";
  }
  return emoji
}

/*
  Calculates the current Average Mood of the Week
*/
export function getAverageMoodWeek(data: TextClassification[] | null) : string { 
  let length = data?.length;
  const [weeklyAverage, setWeeklyAverage] = useRecoilState(AverageWeeklyIndex)

  //@ts-ignore
  let average: number | null | undefined = data?.reduce((total, item) => total + item.average_mood, 0) / length;
  
  if (average) { 
    setWeeklyAverage(average)
  }
  
  let avgString = (average ? (average * 100.0).toString().slice(0, 5) : '0');
  let emoji = Emoji(average || 0)

  let messageToUser = emoji + " " + avgString + "%";

  return messageToUser
}


interface Props { 
  data: TextClassification[] | null
}

function MoodTrackerIndex({data}: Props) {
  // console.log(data)

  let messageToUser = getAverageMoodWeek(data)
// Save global variable 
// const [showAverageWeeklyIndex, setAverageWeeklyIndex] = useRecoilState(AverageWeeklyIndex)
// useEffect(() => {
//   if (average)
//     setAverageWeeklyIndex(messageToUser)
// }, [average])


const dataPoint: DataPoint[] | null | undefined = data?.map((i) => new DataPoint(i)) || defaultDataPoint;


  return (
    <>
    <div className='flex justify-between items-start'>
        <div className='flex flex-col space-y-2 '>
            <div className='text-4xl font-bold text-left relative right-2 text-[#424242] '>
                {messageToUser}
            </div>
            
            <div className='font-bold text-[14px] text-[#757575]'>
                Current Mood Index
            </div>
        </div>
        <div className='w-[120px] h-[42px] relative bottom-7'>
            {/* Insert a graph here */}
          <LineChart data={dataPoint}/>
        </div>
        
    </div>
    
    </>
  )
}

export default MoodTrackerIndex