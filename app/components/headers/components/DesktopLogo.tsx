import React from 'react'


import logo from '../../../public/logos/logo_sm.svg'
import Image from 'next/image'


function DesktopLogo() {
  return (
    <div className=''>

        <div className={`w-fit h-fit`} style={{ boxShadow: '0 0 25px 0 rgba(0, 0, 0, 0.25)' }}>
            <Image src={logo} 
                height={36} 
                width={36} 
                alt='logo' 
                className=''/>  
        </div>


        <div className='flex flex-col text-left'>
            <h1 className='font-bold text-left text-[19px]'>Reflection</h1>
            <h2 className='font-medium text-[#757575] text-[14px]'>Journal, Analyse & Plan</h2>
        </div>


    </div>
  )
}

export default DesktopLogo