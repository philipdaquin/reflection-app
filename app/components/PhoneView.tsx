import React, { PropsWithChildren } from 'react'
import HomeContents from './pages/HomeContents'

interface Props { 
  children: any
}

function PhoneView({children}: Props) {
  return (
    <div className=' md:w-[424px] md:h-[803px] bg-white md:shadow-xl md:rounded-[70px] md:border-[#F5F5F5] md:border-8 border-white shadow-inherit '>
        <div className='
          md:w-full 
          md:px-4 
          md:pt-10 
          md:border-[16px] 
          md:shadow-sm 
          md:border-[#FCFCFC] 
          md:rounded-[60px] 
          md:bg-white 
          md:overflow-scroll 
          md:scrollbar-hide 
          md:py-4 
          w-screen
          h-full 
          pt-12 
          py-14
          px-10
          border-0
          rounded-none
          shadow-inherit
          transition-transform
          duration-700
          ease-in-out
'>
          {children}
        </div>
    </div>

  )
}

export default PhoneView