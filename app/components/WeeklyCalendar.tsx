import React, { useState } from 'react'
import {ChevronLeftIcon, ChevronDownIcon,  ChevronRightIcon} from '@heroicons/react/24/outline'
import 'react-datepicker/dist/react-datepicker.css';



interface Props { 
    setCurrDate: any,
    setShowWeekly: any,
    showWeekly: any
}

function WeeklyCalendar({setCurrDate, setShowWeekly, showWeekly}: Props) {
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

    // Defaulted to Daily 
    // const [showWeekly, setShowWeekly] = useState('Daily')
    const openWeeklySummary = (input: string) => { 
        setShowWeekly(input)
    }

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

    const selectDate = (day: Date) => { 
        setSelectedDate(day)
        setCurrDate(day)
        console.log(day)
    }


    const onHover = "hover:bg-[#f5f5f5] active:bg-[#E0E0E0] active:rounded-full"
    const WeeklyColour = showWeekly === 'Weekly' ? 'text-white bg-black' : 'border-2 bg-white text-black border-[#e0e0e0' 
    const DailyColour = showWeekly === 'Daily' ? 'text-white bg-black' : 'border-2 bg-white text-black border-[#e0e0e0' 

    const [showCalendar, setShowCalendar] = useState(false)

    const toggleCalendar = () => { 
        setShowCalendar(!showCalendar)
    }

    const handleOpenWeekly = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { 
        e.stopPropagation()
        openWeeklySummary('Daily')
    }
    const handleOpenDaily = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { 
        e.stopPropagation()
        openWeeklySummary('Weekly')
    }


    return (
        <div className='w-full bg-[#FEFEFE] space-y-5 relative md:rounded-t-[70px] md:px-3 px'>
             <div className='flex flex-row justify-between py-2 space-x-2 '>
                <button onClick={prevWeek} className={`${onHover} p-2 rounded-full`}>
                    <ChevronLeftIcon height={20} width={20} color='#757575'/>
                </button>

                    <div onClick={toggleCalendar} className='flex cursor-pointer flex-row items-center space-x-2 px-4 hover:bg-[#f5f5f5] hover:rounded-full active:bg-[#E0E0E0] active:rounded-full'>
                        <div className='font-semibold md:text-[14px] text-base '>{day}, {month} {year}</div>
                        <ChevronDownIcon height={16} width={16} color='#757575'/>
                    </div>
                <button onClick={nextWeek} className={`${onHover} p-2 rounded-full`}>
                    <ChevronRightIcon height={20} width={20} color='#757575'/>
                </button>
            </div>

          
            <div className='space-y-2'>
                <div className='flex flex-row-reverse'>
                    <div className='flex items-center space-x-1'>
                        <div onClick={(e) => handleOpenWeekly(e)}   className={`cursor-pointer  text-xs ${DailyColour}
                            rounded-full px-4 py-1`}>
                            Today
                        </div>
                        <div onClick={(e) => handleOpenDaily(e)} 
                            className={`cursor-pointer text-xs rounded-full px-4 py-1 ${WeeklyColour}`} >
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
                                ${selectedDate && selectedDate.getUTCDate() === day.getUTCDate() ? 
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