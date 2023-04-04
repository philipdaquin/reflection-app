import React from 'react'

interface Props { 
    name: string
}
function SuggestedTags({name}: Props) {
  return (
    <div className='text-[#4285f4] text-[14px] items-center justify-center
         text-left font-bold px-2 py-1 capitalize w-fit h-fit bg-[#4285f4]/20 mr-1 mb-1
         rounded-lg'>{name}</div>
  )
}

export default SuggestedTags