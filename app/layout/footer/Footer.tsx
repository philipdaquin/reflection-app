import React from 'react'
import QRCode from '../../components/qrcode/QRCode'
import Link from 'next/link'
import { Router } from 'next/router'
import SmallButton from '../../components/button/SmallButton'

function Footer() {
  
  return (

    <>
      <div className='flex flex-row w-full justify-between items-center md:px-[59px] '>
        <div className='flex items-center space-x-4 text-[#757575]  flex-row  text-left text-[12px] font-medium'>
              {/* <SettingsToggle /> */}
              
              <Link href={`/onboarding/signup`}>     
                <SmallButton title="Sign Up" />
              </Link>

              <Link href={`/signin`}>     
                <SmallButton title="Log In" />
              </Link>


          </div>



        <QRCode />
      </div>
    </>
  )
}

export default Footer