import React, { useEffect, useState } from 'react'
import MoodSummary from '../MoodSummary'
import MoodAreaChart from '../MoodAreaChart'
import { DefaultFilterOption, FilterOptions, TextClassification, MoodDataPoint, ALL_FILTER } from '../../typings'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRecoilState } from 'recoil'
import { SelectedFilterOption } from '../../atoms/atoms'

interface Props { 
    all_mood_data: TextClassification[] | null | undefined,
    hideFilter?: boolean
}

export function getFilterOption(filter: string): FilterOptions {   
    return ALL_FILTER.find((item, i) => item.label === filter) || DefaultFilterOption

}

// todo!
export const getFilteredData = (data: TextClassification[], filter: FilterOptions) => {
    const currentDate = new Date();

    switch (filter.value) {
    
    case '1d':
        return data.filter(
            (item) =>
              new Date(item.date).getDate() === currentDate.getDate() &&
              new Date(item.date).getMonth() === currentDate.getMonth() &&
              new Date(item.date).getFullYear() === currentDate.getFullYear()
          );

    case '1w':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return data.filter((item) => new Date(item.date) >= oneWeekAgo);
    default:
        return data;
    }
};

function MoodAnalysisChange({all_mood_data, hideFilter}: Props) {


    const [, setFilter] = useRecoilState(SelectedFilterOption)

    const [chartData, setChartData] = useState<MoodDataPoint[] | null>();
    const [filterOption, setFilterOption] = useState<FilterOptions>(DefaultFilterOption);

    const selectFilter = (label: string) => { 
        const option = getFilterOption(label)
        setFilterOption(option)
        // Global
        setFilter(option)
    }


    // Filter data based on the filter 
    useEffect(() => {
        if (!all_mood_data) return 
        let data = getFilteredData(all_mood_data, filterOption)
            .map((i) => new MoodDataPoint(i))
        
        setChartData(data)

    }, [all_mood_data, filterOption])
    

    return (
        <div className='widget_container'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-left font-medium text-[20px] '>
                    Mood Summary
                </h1>
                {
                    !hideFilter && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="capitalize bg-[#f5f5f5] rounded-lg px-5 py-1 text-sm border-2 font-medium cursor-pointer active:scale-90  hover:bg-[#eaeaea]">
                            {filterOption.label}
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow  bg-base-100 rounded-box w-fit">
                            {
                                ALL_FILTER.map((item, i ) => { 
                                    return (
                                        <li className='text-xs font-medium capitalize items-center' onClick={() => selectFilter(item.label)}>
                                            <a className='active:bg-black text-center'>{item.label}</a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    )
                }
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
            </div>
        </div>
    )
}

export default MoodAnalysisChange