import React from 'react'

function SmallDivider() {
  return (
    <div className='flex flex-row items-center w-full justify-between px-[34px]'>
      <div className='h-[1px] w-[129px] bg-[#e0e0e0]'>
      </div>
      <h1 className='text-sm font-bold text-center text-[#757575]'>
        OR
      </h1>
      <div className='h-[1px] w-[129px] bg-[#e0e0e0]'>
      </div>
    </div>
  )
}

export default SmallDivider