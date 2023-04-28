import React, { useState } from 'react'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline'

interface Props { 
    setCurrDate: any
}

function WeeklyCalendar({setCurrDate}: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const prevWeek = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    };

    const nextWeek = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const days = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        days.push(date);
    }

    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    const year = currentDate.getFullYear();

    const setDate = (e: Date) => { 
        setCurrDate(e)
    }

    return (
        <div className='w-full'>
            <div className='flex justify-between py-2'>
                <button onClick={prevWeek} className='text-xs'>
                    <ChevronLeftIcon height={20} width={20} color='#000'/>
                </button>
                <div className='font-semibold text-lg '>{month} {year}</div>

                <button onClick={nextWeek}>
                <ChevronRightIcon height={20} width={20} color='#000'/>

                </button>
            </div>
            <ul className='flex flex-row space-x-3 pt-5 justify-center'>
                {days.map((day, index) => (
                <li key={index} onClick={(e) => setDate(day)}>
                    <div className='flex flex-col bg-[#F5F5F5] 
                        md:w-10 w-12
                        py-2 items-center rounded-xl'>
                        <p className='text-[10px] font-medium text-[#757575]'>
                            {daysOfWeek[index].slice(0, 3)} 
                        </p>
                        <p className='text-sm'>
                            {day.getDate()}
                        </p>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
}
export default WeeklyCalendar