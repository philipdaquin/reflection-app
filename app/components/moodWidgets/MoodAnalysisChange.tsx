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
        <div className='w-full min-h-fit px-5 py-4 rounded-[15px] border-[1px] border-[#e0e0e0]'>
            <h1 className='text-left font-medium text-[15px] '>
                How your mood changes 
            </h1>

            <div className='pt-[23px]'>
                <MoodSummary />
            </div>
            
            <div className='pt-[38px] h-[210px]'>
                {
                    weeklyData && (
                        <MoodAreaChart data={DEFAULT_TEST_WEEKLY} />
                    )
                }

            </div>
            {/* <div>
                {
                    mood_graph && (
                        <div className="flex justify-center items-center space-x-4">
                            <label htmlFor="filter">Filter:</label>
                            <select
                            name="filter"
                            id="filter"
                            value={filterOption}
                            onChange={handleFilterChange}
                            className="p-2 border rounded-md"
                            >
                                <option value="all">All</option>
                                <option value="1d">1 Day</option>
                                <option value="1w">1 Week</option>
                                <option value="1m">1 Month</option>
                                <option value="1y">1 Year</option>
                            </select>
                        </div>
                    )
                }
            </div> */}
            <div className=' flex flex-row justify-between w-full pt-3'>
                {
                    filter.map((item, i) => { 
                        return (
                            <div className={`text-xs cursor-pointer
                                ${filterOption === item ? 'bg-[#e0e0e0]' : ''} 
                            text-[#757575]  rounded-full px-4 py-1`}
                                onClick={() => selectFilter(i)}
                            >
                                {item}
                            </div>
                        )
                    })
                }
            </div>
                    

        </div>
    )
}

export default MoodAnalysisChange