import React from 'react'
import LineChart from './LineChart';


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


function MoodTrackerIndex() {
  const data = [
    { date: "2022-01-01", mood: 2.0 },
    { date: "2022-01-02", mood: 4.0 },
    { date: "2022-01-03", mood: 5.0 },
    { date: "2022-01-04", mood: 6.0 },
    { date: "2022-01-05", mood: 4.0 },
    { date: "2022-01-06", mood: 2.0 },
    { date: "2022-01-07", mood: 10.0 },
    { date: "2023-03-20", mood: 9.0   },  
    { date: "2023-03-21", mood: 9.0   },  
    { date: "2023-03-22", mood: 8.0   },  
    { date: "2023-03-23", mood: 9.0   },  
    { date: "2023-03-24", mood: 8.0   },  
    { date: "2023-03-25", mood: 9.0   },  
    { date: "2023-03-26", mood: 10.0  }
  ];

  let average = data.reduce((total, item) => total + item.mood, 0) / data.length;
  let avgString = (average * 10.0).toString().slice(0, 5)
  let messageToUser = Emoji(average) + " " + avgString + "%"

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
            <LineChart data={data} />
        </div>
    </div>
  )
}

export default MoodTrackerIndex