import React, { useState } from 'react'

function WeeklyCalendar() {
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

    return (
        <div>
        <button onClick={prevWeek}>Previous week</button>
        <button onClick={nextWeek}>Next week</button>
        <div>{month} {year}</div>
        <ul>
            {days.map((day, index) => (
            <li key={index}>
                {daysOfWeek[index]} {day.getDate()}
            </li>
            ))}
        </ul>
        </div>
    );
}
export default WeeklyCalendar