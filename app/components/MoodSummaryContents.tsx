import React from 'react'
import MoodAreaChart from './MoodAreaChart'
import {ArrowDownCircleIcon} from '@heroicons/react/24/solid'
import CommonMoodContainer from './CommonMoodContainer'
import { TextClassification, WeeklyData, WeeklySummary } from '../typings'
import { AverageWeeklyIndex } from '../atoms/atoms'
import { useRecoilValue } from 'recoil'
import { getAverageMoodWeek } from './MoodTrackerIndex'


// const data: WeeklyData[] = [
//     { name: 'M', mood: 4 },
//     { name: 'Tu', mood: 3 },
//     { name: 'W', mood: 0 },
//     { name: 'Th', mood: 10 },
//     { name: 'F', mood: 7 },
//     { name: 'Sa', mood: 4 },
//     { name: 'Su', mood: 10 },
// ];

// const moodData: CommonMoodData[] = [
//     {
//       emotion_emoji: '😊',
//       emotion: 'Happy',
//       percentage: 3.5,
//     },
//     {
//       emotion_emoji: '😔',
//       emotion: 'Sad',
//       percentage: 2.1,
//     },
//     {
//       emotion_emoji: '😐',
//       emotion: 'Neutral',
//       percentage: 2.8,
//     },
//     {
//       emotion_emoji: '😃',
//       emotion: 'Excited',
//       percentage: 4.2,
//     },
//     {
//       emotion_emoji: '😴',
//       emotion: 'Tired',
//       percentage: 1.9,
//     },
// ].slice(0, 3);

// const recommendedActivities: RecommendedActivity[] = [
//     {
//         title: "Exercise",
//         description: "Going for a run or doing a quick workout can help release endorphins, which can improve your mood and reduce stress levels.",
//         emoji: "🏃‍♀️"
//     },
//     {
//         title: "Mindfulness",
//         description: "Taking a few minutes to focus on your breath and observe your thoughts can help you feel more calm and centered.",
//         emoji: "🧘"
//     },
//     {
//         title: "Socializing",
//         description: "Connecting with friends or loved ones can provide a sense of support and belonging, which can boost your mood and reduce feelings of loneliness.",
//         emoji: "👥"
//     },
//     {
//         title: "Gratitude",
//         description: "Taking time to appreciate the good things in your life can help shift your focus away from negative thoughts and improve your overall outlook.",
//         emoji: "🙏"
//     },
//     {
//         title: "Creativity",
//         description: "Engaging in a creative activity, such as painting or writing, can help you express yourself and tap into positive emotions.",
//         emoji: "🎨"
//     }
// ].slice(0, 3);

// const eventData: EventData[] = [
//     {
//         title: "Gratitude",
//         summary: "Today I'm feeling so grateful for my family and friends who have supported me throughout my life.",
//         emoji: "🙏"
//     },
//     {
//         title: "Self-reflection",
//         summary: "I've been thinking a lot about my goals and what I want to achieve in the next few months.",
//         emoji: "🤔"
//     },
//     {
//         title: "Mindfulness",
//         summary: "I spent some time meditating this morning and it really helped me to feel more centered and focused.",
//         emoji: "🧘"
//     },
//     {
//         title: "Emotional release",
//         summary: "I had a really tough day today and I just needed to let it all out. Talking about my feelings in my journal helped me to feel better.",
//         emoji: "😔"
//     },
//     {
//         title: "Inspiration",
//         summary: "I listened to a great podcast today that really inspired me to try something new.",
//         emoji: "💡"
//     }
// ].slice(0, 3);

interface Props { 
    mood_graph: TextClassification[] | null,
    weekly_summary: WeeklySummary | null
}

function MoodSummaryContents({mood_graph, weekly_summary}: Props) {
    const most_common_mood = weekly_summary?.common_mood || []
    const eventData = weekly_summary?.important_events || []
    const recommendedActivities = weekly_summary?.recommendations || []

    const weeklyData: WeeklyData[] | null | undefined = mood_graph?.map((i) => new WeeklyData(i))
    
    // const weeklyIndex = useRecoilValue(AverageWeeklyIndex);
    // console.log(weeklyIndex)
    const weeklyIndex = getAverageMoodWeek(mood_graph)

    return (
        <section className=''>

            <h1 className='items-center flex justify-center font-bold text-center text-base text-[#212121]'>
                Weekly Summary
            </h1>

            <div className='pt-[20px] space-y-1'>
                <h1 className='text-left font-bold text-[#757575] text-[14px]'>
                    Weekly Mood Score
                </h1>
                <div className='flex justify-between items-center'>
                    <h1 className='text-[30px] font-bold'>{weeklyIndex || ''}</h1>
                    <div className='flex items-center space-x-1'>
                        <ArrowDownCircleIcon height={20} width={20} color="#757575"/>
                        <p className='text-center text-[#757575] text-[12px]'>
                            10% Down from lastweek
                        </p>
                    </div>
                </div>
            </div>

            {/* Mood trend Graph */}
            { weeklyData && (
            
            <div className='w-full items-center pt-12'>
                <MoodAreaChart data={weeklyData}/>
            </div>
            
            )}

            {/* Common Mood  */}
            <div className='pt-[24px] space-y-3'>
                <h1 className='text-left font-bold text-[#757575] text-[14px]'>Most Common Moods</h1>
                <div className='flex flex-wrap '>
                    {
                        most_common_mood?.map((data, k) => {
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
                <h1 className='text-left font-bold text-[#757575] text-[14px]'>Events that affected your mood</h1>
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
                <h1 className='text-left font-bold text-[#757575] text-[14px]'>Recommended Activities</h1>
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