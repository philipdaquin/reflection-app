import React, { PropsWithChildren } from 'react'
import HomeContents from './pages/HomeContents'
import { Toaster } from 'react-hot-toast'

interface Props { 
  children: any
}

function PhoneView({children}: Props) {
  return (
    <div className='md:w-[424px] md:h-[768px]
      md:relative
      bg-white 
      md:rounded-[60px] 
      md:border-8 
      border-white 
      md:border-[#F5F5F5] 
      ' 
      style={{ boxShadow: ' 0 7px 41px 0 rgba(0, 0, 0, 0.27)' }}>
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
          static
          md:py-4 
          w-screen
          h-full 
          pt-12 
          py-14
          px-4
          border-0
          rounded-2xl
          shadow-inherit'
          >
          {children}
        </div>
    </div>
  )
}

export default PhoneView