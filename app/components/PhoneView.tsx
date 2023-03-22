import React from 'react'
import Contents from './Contents'

function PhoneView() {
  return (
    <div className='w-[424px] h-[803px] bg-white shadow-xl rounded-[70px] border-[#F5F5F5] border-8'>
        <div className='w-full h-full border-[16px] shadow-sm border-[#FCFCFC] rounded-[60px] bg-white p-2'>
            <Contents />
        </div>
    </div>
  )
}

export default PhoneView