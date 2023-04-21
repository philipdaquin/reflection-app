import React from 'react'
import BorderLinearProgress from './BorderLinearProgress'
import UserJobList from './UserJobList'
import { JobList } from '../typings'


   
interface Props { 
    list: JobList[] 
}

function WeeklyRoundUpComp({list}: Props) {

    let maxProgress = 100 
    let currValue = 20

   
    return (
        <div className='flex flex-col'>
            <div className=''>
                <h1 className="font-bold text-left text-xl text-black">
                    Weekly Roundups
                </h1>
                <h3 className='text-[#757575] text-left font-normal text-sm'>3rd week of March</h3>
            </div>
            <div className='pt-3'>
                <BorderLinearProgress max={list.length} value={list.filter((f) => f.isDone == true).length } />
            </div>

            <div className='space-y-3 pt-4'>
                {
                    list.map((jobList, i) => {
                        return <UserJobList 
                            key={i}
                            title={jobList.title}
                            details={jobList.details}
                            isDone={jobList.isDone}
                        />
                    })
                }
            </div>
            
        </div>
    )
}

export default WeeklyRoundUpComp



