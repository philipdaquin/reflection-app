import React from 'react'


interface Props {
    title: string 
    date: string 
}

function InsightContainer({title, date}: Props) { 
    return (
        <div className='w-full  text-left px-5 py-4 space-y-2 rounded-[15px] border-[1px] border-[#e0e0e0]'>
            <h2 className='text-left text-xs font-medium text-[#757575]'>{title}</h2>
            <h1 className='text-left text-lg font-semibold'>
                {date}
            </h1>
        </div>
    )
}


function MoodInsightWidget() {
  return (
    <div className='flex flex-col space-y-4 '>
        <div className='flex space-x-4'>
            <InsightContainer date='Mon, 1 April' title='🏆 Best Day'/>
            <InsightContainer date='Tue, 3 April' title='😖 Worst Day'/>
        </div>
        <div className='flex space-x-4'>
            <InsightContainer date='Mon, 1 April' title='😐 Change in Mood'/>
            <InsightContainer date='😆 80%' title='💪 Dominant Mood'/>
        </div>
    </div>
  )
}

export default MoodInsightWidget