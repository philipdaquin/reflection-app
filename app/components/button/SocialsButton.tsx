import React from 'react'

interface Props { 
    icon: any,
    name: string
}


function SocialsButton({icon, name}: Props) {
  return (
    <div className=' py-4 w-full items-center duration-200 transition-colors ease-in-out flex flex-row justify-center hover:bg-[#E0E0E0]  bg-[#f5f5f5] rounded-[25px]'>
        <div>
            {icon}
        </div>
        <h1 className='font-medium text-[16px] text-center text-black justify-center flex flex-row'>
            {name}
        </h1>
    </div>
  )
}

export default SocialsButton