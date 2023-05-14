import React from 'react'

interface Props { 
    children: any
}
function SuggestedTags({children}: Props) {
  return (
    <div className='text-[#4285f4] text-[14px] items-center justify-center cursor-pointer
         text-left font-bold px-3 py-1 capitalize w-fit h-fit bg-[#EAF2FE] hover:bg-[#4285f4]/20 mr-1 mb-1
         rounded-lg'>{children}</div>
  )
}

export default SuggestedTags