import React, { PropsWithChildren } from 'react'
import HomeContents from './pages/HomeContents'

interface Props { 
  children: any
}

function PhoneView({children}: Props) {
  return (
    <div className='transition-all duration-500 ease-in-out md:w-[424px] md:h-[803px] bg-white md:shadow-xl md:rounded-[70px] md:border-[#F5F5F5] md:border-8 border-white shadow-inherit '>
        <div className='md:px-4 md:pt-10 pt-12 w-full h-full md:border-[16px] md:shadow-sm md:border-[#FCFCFC] md:rounded-[60px] md:bg-white md:p-2 shadow-inherit
         md:overflow-scroll md:scrollbar-hide md:py-4 py-14
'>
          {children}
        </div>
    </div>

  )
}

export default PhoneView