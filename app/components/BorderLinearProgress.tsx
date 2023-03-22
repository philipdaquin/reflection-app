import React from 'react'
import { useEffect, useState } from "react";

interface Props { 
    value: number
    max: number
}

function MessageGen(curr: number, max: number): string { 
    
    let currProgress = (curr / max) * 100

    switch (currProgress) { 
        case (10):
            return "Great job! You're off to a great start, keep it up!"
        case (30):
            return "Awesome progress, keep it up!"
        case (50):
            return "Halfway there, keep pushing!"
        case (75) :
            return "Almost there, keep the momentum!"
        case (100):
            return "Congratulations, you did it!"
        default:
            return "Keep making progress, you've got this!"
    }
} 


function BorderLinearProgress({value, max} : Props) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      if (value > max) {
        setProgress(100);
      } else {
        setProgress((value / max) * 100);
      }
    }, [value, max]);
  
    return (
        <div className='flex flex-col'>
            <div className="relative h-[10px] rounded-full bg-gray-200 overflow-hidden">
                <div
                className="absolute top-0 left-0 h-full bg-[#43cb9c]"
                style={{ width: `${progress}%` }}
                >
                <div className="h-full transform scale-x-0 bg-[#43cb9c] animate-expand"></div>
                </div>
            </div>
            <h3 className='text-[#757575] text-left font-normal text-sm'>{
                MessageGen(value, max)
            }</h3>
        </div>
    );
}

export default BorderLinearProgress