import React from 'react'
import Contents from './Contents'

function PhoneView() {
  return (
    <div className='transition-all duration-500 ease-in-out  md:w-[424px] md:h-[803px] bg-white md:shadow-xl md:rounded-[70px] md:border-[#F5F5F5] md:border-8 border-white shadow-inherit'>
        <div className='md:px-4 md:pt-10 w-full h-full md:border-[16px] md:shadow-sm md:border-[#FCFCFC] md:rounded-[60px] md:bg-white md:p-2 shadow-inherit md:overflow-scroll md:scrollbar-hide'>
            <Contents />
        </div>
    </div>

  )
}

export default PhoneView