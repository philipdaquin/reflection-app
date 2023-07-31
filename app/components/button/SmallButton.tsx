import Link from 'next/link'
import React from 'react'


interface Props { 
    title: string,

}
function SmallButton({title}: Props) {
    return  (
      <div className='cursor-pointer  duration-400  px-3 py-2 bg-[#FFFEFE]
        hover:bg-[#eaeaea] transition-colors delay-500 rounded-md'>     
          <p className=''>{title}</p>
      </div>
    )
  } 
  
  
export default SmallButton