import React, { useState } from 'react'
import MoodSummary from '../MoodSummary'
import MoodAreaChart from '../MoodAreaChart'
import { DEFAULT_TEST_WEEKLY, TextClassification, WeeklyData } from '../../typings'

interface Props { 
    mood_graph: TextClassification[] | null
}


function MoodAnalysisChange({mood_graph}: Props) {


    // Testing purposes 
    const weeklyData: WeeklyData[] | null | undefined = mood_graph?.map((i) => new WeeklyData(i))
    

    const [chartData, setChartData] = useState<TextClassification[] | null >(mood_graph);
    const [filterOption, setFilterOption] = useState('all');
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOption(e.target.value);
    };

    let filter = [
        "1d",
        "1w",
        "2w",
        "1m",
        "1y",
        "all",
    ]

    const selectFilter = (idx: number) => { 
        setFilterOption(filter[idx])
    }

    // const getFilteredData = (data: TextClassification[], filter: string) => {
    //     switch (filter) {
    //       case '1d':
    //         return data.slice(-1);
    //       case '1w':
    //         return data.slice(-7);
    //       case '1m':
    //         const oneMonthAgo = new Date();
    //         oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    //         return data.filter((item) => new Date(item.date) >= oneMonthAgo);
    //       case '1y':
    //         const oneYearAgo = new Date();
    //         oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    //         return data.filter((item) => new Date(item.date) >= oneYearAgo);
    //       default:
    //         return data;
    //     }
    //   };

    
    return (
        <div className='widget_container'>
            {/* <h1 className='text-left font-medium text-[20px] '>
                Mood Summary
            </h1> */}

            {/* <div className='pt-4'> */}
                <MoodSummary />
            {/* </div> */}
            <div className='pt-[38px]'>
                <div className=' h-[210px] md:h-[157px]'>
                    {
                        weeklyData && (
                            <MoodAreaChart data={DEFAULT_TEST_WEEKLY} />
                        )
                    }

                </div>

                <div className='pt-6'>
                    <div className=' flex flex-row w-full items-center bg-[#f5f5f5] rounded-xl  px-2 py-2 md:px-1 md:py-1 justify-between'>
                        {
                            filter.map((item, i) => { 
                                return (
                                    <div className={`text-xs cursor-pointer 
                                        ${filterOption === item ? 'bg-[#212121] text-white' : 'font-semibold'} 
                                    text-[#757575]  rounded-lg px-5 py-2 md:px-2 md:py-1`}
                                        onClick={() => selectFilter(i)}
                                    >
                                        {item}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MoodAnalysisChange