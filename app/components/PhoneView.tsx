import React, { PropsWithChildren } from 'react'
import HomeContents from './pages/HomeContents'
import { Toaster } from 'react-hot-toast'

interface Props { 
  children: any
}

function PhoneView({children}: Props) {
  return (
    <div className='md:w-[424px] md:h-[803px]
      bg-white md:shadow-xl md:rounded-[70px] 
      md:border-[#F5F5F5] md:border-8 
      border-white shadow-inherit '>
        <div className='
          md:w-full 
          md:px-3
          md:pt-10 
          md:border-[16px] 
          md:shadow-sm 
          md:border-[#FCFCFC] 
          md:rounded-[60px] 
          md:bg-white 
          md:overflow-scroll 
          md:scrollbar-hide 
          md:py-4 
          w-full
          h-full 
          pt-12 
          py-14
          px-4
          border-0
          rounded-2xl
          shadow-inherit'
          >
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          {children}
        </div>
    </div>
  )
}

export default PhoneView