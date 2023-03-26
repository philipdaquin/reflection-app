import React from 'react'
import MoodAreaChart from './MoodAreaChart'
import {ArrowDownCircleIcon} from '@heroicons/react/24/solid'


function MoodSummaryContents() {
    const data = [
        { name: 'M', mood: 4 },
        { name: 'Tu', mood: 3 },
        { name: 'W', mood: 8 },
        { name: 'Th', mood: 10 },
        { name: 'F', mood: 7 },
        { name: 'Sa', mood: 4 },
        { name: 'Su', mood: 0 },
      ];


    return (
        <section>

            <h1 className='items-center flex justify-center font-bold text-center text-base text-[#212121]'>
                Weekly Summary
            </h1>

            <div className='pt-[20px] space-y-1'>
                <h1 className='text-left font-bold text-[#757575] text-[14px]'>
                    Weekly Mood Score
                </h1>
                <div className='flex justify-between items-center'>
                    <h1 className='text-[30px] font-bold'>😆 80.2%</h1>
                    <div className='flex items-center space-x-1'>
                        <ArrowDownCircleIcon height={20} width={20} color="#757575"/>
                        <p className='text-center text-[#757575] text-[12px]'>
                            10% Down from lastweek
                        </p>
                    </div>
                </div>
            </div>


            <div className='w-full items-center pt-10'>
                <MoodAreaChart data={data}/>
            </div>

            <div>
                <h1>Most Common Moods</h1>
                <div>

                </div>
            </div>


        </section>
    )
}

export default MoodSummaryContents