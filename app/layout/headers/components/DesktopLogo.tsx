import React from 'react'


import logo from '../../../public/logos/logo_sm.svg'
import Image from 'next/image'
import Link from 'next/link'


function DesktopLogo() {
  return (
    <>
        <div className='flex flex-row items-center w-fit rounded-md'>
          <Link href={"/"} className='flex flex-row space-x-3'>
                <div className={`w-fit h-fit`} style={{ boxShadow: '0 0 25px 0 rgba(0, 0, 0, 0.25)' }}>
                    <Image src={logo} 
                        height={36} 
                        width={36} 
                        alt='logo' 
                        className=''/>  
                </div>


                <div className='flex flex-col text-left -space-y-1'>
                    <h1 className='font-bold text-left text-[19px]'>Reflection</h1>
                    <h2 className='font-medium text-[#757575] text-[14px]'>Journal, Analyse & Plan</h2>
                </div>

          </Link>
        </div>
    </> 
  )
}

export default DesktopLogo