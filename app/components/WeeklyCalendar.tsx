import React, { useState } from 'react'
import {ChevronLeftIcon, ChevronDownIcon,  ChevronRightIcon} from '@heroicons/react/24/outline'




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
    const currDay = currentDate.getDay()
  
    let day = daysOfWeek[currDay]
  
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

    const [showWeekly, setShowWeekly] = useState(false)
    const openWeeklySummary = () => { 
        setShowWeekly(!showWeekly)
    }

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const selectDate = (day: Date) => { 
        setSelectedDate(day)
        setCurrDate(day)
    }


    const onHover = "hover:bg-[#f5f5f5] "

    return (
        <div className='w-full bg-white space-y-5'>
             <div className='flex flex-row justify-between py-2 space-x-2'>
                <button onClick={prevWeek} className={`${onHover} p-2 rounded-full`}>
                    <ChevronLeftIcon height={20} width={20} color='#757575'/>
                </button>
                <div className='flex flex-row items-center space-x-4'>
                    <div className='font-semibold text-lg '>{day}, {month} {year}</div>
                    <ChevronDownIcon height={20} width={20} color='#757575'/>
                </div>

                <button onClick={nextWeek} className={`${onHover} p-2 rounded-full`}>
                    <ChevronRightIcon height={20} width={20} color='#757575'/>
                </button>
            </div>
            <div className='space-y-2'>
                <div className='flex flex-row-reverse'>
                    <div className='flex items-center space-x-1'>
                        <div  className={`cursor-pointer  text-xs text-white 
                            rounded-full px-4 py-1 bg-black`}>
                            Today
                        </div>
                        <div onClick={openWeeklySummary} 
                            className={`cursor-pointer border-2 text-xs border-[#e0e0e0] rounded-full px-4 py-1 bg-white`} >
                            Weekly
                        </div>
                    </div>
                </div>

                <ul className='flex flex-row items-center justify-between'>
                    {days.map((day, index) => (
                    <li key={index} onClick={(e) => selectDate(day)}>
                        <div className={`flex flex-col cursor-pointer md:w-10 w-12 items-center rounded-xl space-y-1`}>
                            <p className={`
                                text-[10px] 
                                w-8 h-8  p-2
                                items-center text-center 
                                rounded-full
                                ${selectedDate && selectedDate.getTime() === day.getTime() ? 
                                    'bg-black text-white  ' : 
                                    'bg-white '
                                }
                                font-medium text-[#757575]`}>

                                {daysOfWeek[index].slice(0, 2)} 
                            </p>

                            <div className='items-center text-center '>
                                <p className='text-sm'>
                                    {day.getDate()}
                                </p>
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default WeeklyCalendar