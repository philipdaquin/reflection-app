import React, { useState } from 'react'
import { SelectedFilterOption } from '../atoms/atoms';
import { ALL_FILTER, DefaultFilterOption, FilterOptions } from '../typings';
import { useRecoilState } from 'recoil';
import { getFilterOption } from './moodWidgets/MoodAnalysisChange';

function MoodFilter() {
    const [filterOption, setFilterOption] = useState<FilterOptions>(DefaultFilterOption);
    const [, setFilter] = useRecoilState(SelectedFilterOption)

    const selectFilter = (label: string) => { 
        const option = getFilterOption(label)
        setFilterOption(option)
        // Global
        setFilter(option)
    }
    const filters = [
        "Today",
        "Weekly",
        "All"
    ]

    const selectedFilter = "underline text-[#424242] "
  return (
    <section className='w-full flex '>
        <div className='flex flex-row space-x-6 items-center '>
            {
                ALL_FILTER.map((item, i) => { 
                    return (
                        <div onClick={() => selectFilter(item.label)}
                            className={`${filterOption.label === item.label ? `${selectedFilter} underline-offset-8` : 'text-[#BDBDBD] no-underline'} 
                                cursor-pointer text-left  text-lg 
                                py-1 font-medium`}>
                         {filters[i]}
                        </div>
                    )
                })
            }
        </div>
    </section>
  )
}

export default MoodFilter