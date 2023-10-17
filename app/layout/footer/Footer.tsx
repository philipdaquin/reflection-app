import React from 'react'
import QRCode from '../../components/qrcode/QRCode'
import Link from 'next/link'
import { Router } from 'next/router'
import SmallButton from '../../components/button/SmallButton'
import useAuth from '../../hooks/useAuth'
import Profile from '../../components/profile/desktop/Profile'
import SettingsToggle from '../../components/SettingsButtons'

function Footer() {
  const {signOut, user}  = useAuth()
  return (
  
    <>
      <div className='flex flex-row w-full justify-between items-center md:px-[59px] '>


        {
          user ? (

            <div className='flex items-center space-x-4 text-[#757575]  flex-row  text-left text-[12px] font-medium'>
              {/* <SettingsToggle /> */}

              <Profile />

              {/* <button className="w-full" onClick={signOut}>
                <SmallButton title='Log Out'/>
              </button> */}
            </div>
          ) : (
            <div className='flex items-center space-x-4 text-[#757575]  flex-row  text-left text-[12px] font-medium'>
                {/* <SettingsToggle /> */}
                <Link href={`/onboarding/signup`}>     
                  <SmallButton title="Sign Up" />
                </Link>

                <Link href={`/signin`}>     
                  <SmallButton title="Log In" />
                </Link>
                <SettingsToggle />
            </div>
          )
        }
        
        



        <QRCode />
      </div>
    </>
  )
}

export default Footer