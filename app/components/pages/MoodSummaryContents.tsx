import React, { useEffect, useState } from 'react'
import MoodAreaChart from '../MoodAreaChart'
import {ArrowDownCircleIcon} from '@heroicons/react/24/solid'
import CommonMoodContainer from '../CommonMoodContainer'
import { TextClassification, WeeklyData, WeeklySummary } from '../../typings'
import { AverageWeeklyIndex } from '../../atoms/atoms'
import { useRecoilValue } from 'recoil'
import { getAverageMoodWeek } from '../MoodTrackerIndex'
import { getWeeklyByDate } from '../../util/weekly/getWeeklyByDate'
import changeInPercentage from '../../util/changeInPercentage'


interface Props { 
    mood_graph: TextClassification[] | null,
    weekly_summary: WeeklySummary | null
}

function MoodSummaryContents({mood_graph, weekly_summary}: Props) {
    const most_common_mood = weekly_summary?.mood_frequency || []
    const eventData = weekly_summary?.important_events || []
    const recommendedActivities = weekly_summary?.recommendations || []

    const weeklyData: WeeklyData[] | null | undefined = mood_graph?.map((i) => new WeeklyData(i))
    
    // const weeklyIndex = useRecoilValue(AverageWeeklyIndex);
    // console.log(weeklyIndex)
    const weeklyIndex = getAverageMoodWeek(mood_graph)

    

    // Fetch previous week data 
    const [previousWeek, setPreviousWeek] = useState<WeeklySummary | null>(null)
    const oneWeek = async (date: Date) => { 
        const lastWeek = await getWeeklyByDate(date)
        setPreviousWeek(lastWeek || null)
    }
    
    useEffect(() => {
      let currentDate = new Date()
      let oneWeekAgo = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate() - currentDate.getDay() - 7)
        oneWeek(oneWeekAgo)
    }, [])
    

    let changeInPercent = changeInPercentage(weekly_summary?.weekly_avg || 0, previousWeek?.weekly_avg || 0)?.toFixed(2) || 0
    const sign = parseFloat(changeInPercent.toString()) 
    const colour = changeInPercent as number > 0 ? 
        "text-[#41d475] " 
    : changeInPercent as number < 0 ? 
        "text-[#E84040]" 

    : "text-[#757575] ";

    return (
        <section className='pb-52'>

            <h1 className='items-center flex justify-center font-bold text-center text-base text-[#212121]'>
                Weekly Summary
            </h1>

            <div className='pt-[20px] space-y-1'>
                <h1 className='text-left font-semibold text-[#757575] text-lg'>
                    Weekly Mood Score
                </h1>
                <div className='flex justify-between items-center'>
                    <h1 className='text-[30px] font-bold'>{weeklyIndex || ''}</h1>
                    <div className='flex items-center space-x-1'>
                        {/* <ArrowDownCircleIcon height={20} width={20} color="#757575"/>
                        <p className='text-center text-[#757575] text-[12px]'>
                            10% Down from lastweek
                        </p> */}
                        <h1 className={`text-left font-semibold text-[23px] ${colour}`}>
                            {changeInPercent || "0.00" } <span className={`text-[15px] ${colour}`}>%</span>
                        </h1>

                        <p className='pt-[1px]  text-left font-semibold text-xs text-[#757575]'>
                            from lastweek
                        </p>   
                    </div>
                </div>
            </div>

            {/* Mood trend Graph */}
            { weeklyData && (
            
            <div className='w-full items-center pt-6 h-[310px] space-y-5 pb-10'>
                <h1 className='text-left font-semibold text-[#757575] text-lg'>
                    Weekly Data Patterns 
                </h1>
                <MoodAreaChart data={weeklyData}/>
            </div>
            
            )}

            {/* Common Mood  */}
            <div className='pt-[24px] space-y-3'>
                <h1 className='text-left font-semibold text-[#757575] text-lg'>Most Common Moods</h1>
                <div className='flex '>
                    {
                        most_common_mood?.slice(0, 3).map((data, k) => {
                            return (
                                
                                <div key={k}>
                                    <CommonMoodContainer moodData={data}/>
                                </div> 

                            )
                        })
                    }
                </div>
            </div>
            
            {/* Events that influenced your emotions */}
            <div className='pt-8 space-y-3'>
                <h1 className='text-left font-semibold text-[#757575] text-lg'>Events that affected your mood</h1>
                <div className='space-y-3'>
                    {
                        eventData.map((v) => { 
                            return (
                                <div className='flex flex-row space-x-2 items-start'>
                                    <div className='text-[30px] px-2 py-1 bg-[#F5F5F5] rounded-2xl w-[53px] h-[53px] flex justify-center'>{v.emoji}</div>
                                    <div>
                                        <h1 className='text-[#424242] font-bold text-[15px] text-left'>{v.title}</h1>
                                        {/* <p className='text-[12px] text-[#424242] '>{v.summary.slice(0, 45)}</p> */}
                                        <p className='text-[12px] text-[#424242] '>{v.summary}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {/* Events that influenced your emotions */}
            <div className='pt-8 space-y-3'>
                <h1 className='text-left font-semibold text-[#757575] text-lg'>Recommended Activities</h1>
                <div className='space-y-3'>
                    {
                        recommendedActivities.map((v) => { 
                            return (
                                <div className='flex flex-row space-x-2 items-start '>
                                    <div className='text-[30px] px-2 py-1 bg-[#F5F5F5] rounded-2xl h-[53px] w-[53px] items-center flex justify-center'>{v.emoji}</div>
                                    <div>
                                        <h1 className='text-[#424242] font-bold text-[15px] text-left'>{v.title}</h1>
                                        <p className='text-[12px] text-[#424242] '>{v.description}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default MoodSummaryContents