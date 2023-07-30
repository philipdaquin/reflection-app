import React from 'react'
import QRCode from '../../components/qrcode/QRCode'
import Link from 'next/link'
import { Router } from 'next/router'


function SmallButton() {
  return  (
    <div className='fixed left-16 bottom-[52px] -m-1 hidden 
      items-center space-x-1 rounded-[12px] p-1 transition-colors 
      xl:flex 2xl:space-x-2 duration-400 bg-white delay-500'>
        Sign Up
    </div>
  )
} 



function Footer() {
  
  return (

    <>
      <div className='flex flex-row w-full justify-between items-center md:px-[59px] '>
        <div className='flex items-center space-x-4 text-[#757575]  flex-row  text-left text-[12px] font-medium'>
              {/* <SettingsToggle /> */}
              
              <Link href={`/onboarding/signup`} className='cursor-pointer  duration-400  px-3 py-2 bg-[#FFFEFE]
                hover:bg-[#eaeaea] transition-colors delay-500 rounded-md'>     
                  <p className=''>Sign Up</p>
              </Link>

              <Link href={`/signin`} className='cursor-pointer  duration-400  px-3 py-2 bg-[#FFFEFE]
                hover:bg-[#eaeaea] transition-colors delay-500 rounded-md'>     
                  <p className=''>Log In</p>
              </Link>


          </div>



        <QRCode />
      </div>
    </>
  )
}

export default Footer