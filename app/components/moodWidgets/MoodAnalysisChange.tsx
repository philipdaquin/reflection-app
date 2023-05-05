import React, { useEffect, useState } from 'react'
import MoodSummary from '../MoodSummary'
import MoodAreaChart from '../MoodAreaChart'
import { DefaultFilterOption, FilterOptions, TextClassification, WeeklyData } from '../../typings'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRecoilState } from 'recoil'
import { SelectedFilterOption } from '../../atoms/atoms'

interface Props { 
    all_mood_data: TextClassification[] | null | undefined
}



function MoodAnalysisChange({all_mood_data}: Props) {


    const [, setFilter] = useRecoilState(SelectedFilterOption)

    const [chartData, setChartData] = useState<WeeklyData[] | null>();
    const [filterOption, setFilterOption] = useState<FilterOptions>(DefaultFilterOption);

    const filter: FilterOptions[] = [
        { label: '24H', value: '1d', interval: 'hour' },
        { label: '1W', value: '1w', interval: 'day', format: 'MMM D' },
        { label: '2W', value: '2w', interval: 'day', format: 'MMM D' },
        { label: '1M', value: '1m', interval: 'day', format: 'MMM D' },
        { label: '1Y', value: '1y', interval: 'month', format: 'MMM YY' },
        { label: 'All', value: 'all', interval: 'day', format: 'MMM D' }
    ];
    

    const selectFilter = (idx: number) => { 
        setFilterOption(filter[idx])
        // Global
        setFilter(filter[idx])
    }

    const getFilteredData = (data: TextClassification[], filter: FilterOptions) => {
        switch (filter.value) {
          case '1d':
            return data.slice(-1);
          case '1w':
            return data.slice(-7);
          case '2w':
            return data.slice(-14);
          case '1m':
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return data.filter((item) => new Date(item.date) >= oneMonthAgo);
          case '1y':
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            return data.filter((item) => new Date(item.date) >= oneYearAgo);
          default:
            return data;
        }
      };


    // Filter data based on the filter 
    useEffect(() => {
        if (!all_mood_data) return 

        let data = getFilteredData(all_mood_data, filterOption)
            .map((i) => new WeeklyData(i))
        
        setChartData(data)

    }, [all_mood_data, filterOption])
    

    return (
        <div className='widget_container'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-left font-medium text-[20px] '>
                    Mood Summary
                </h1>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="capitalize bg-[#f5f5f5] rounded-lg px-5 py-1 text-sm border-2 font-medium cursor-pointer active:scale-90  hover:bg-[#eaeaea]">
                        {filterOption.label}
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-fit">
                        {
                            filter.map((item, i ) => { 
                                return (
                                    <li className='text-xs font-medium capitalize items-center' onClick={() => selectFilter(i)}>
                                        <a className='active:bg-black text-center'>{item.label}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>

            {/* <div className='widget_container'>
                <MoodSummary />
            </div> */}
            <div className='pt-[38px]'>
                <div className=' h-[210px] md:h-[157px]'>
                    {
                        chartData && (
                            <MoodAreaChart data={chartData} />
                        )
                    }

                </div>

                {/* <div className='pt-6'>
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
                </div> */}
            </div>

        </div>
    )
}

export default MoodAnalysisChange