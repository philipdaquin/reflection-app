import React from 'react'
import DesktopLogo from './components/DesktopLogo'
import { useRouter } from 'next/router';
import Image from 'next/image';

import logo from '../../public/logos/logoMain.svg'
import Link from 'next/link';


function Headers() {
  
  const router = useRouter()

    const NotHomePage =
        router.pathname === '/signin' ||
        router.pathname === '/onboarding/signup'
   
  
  
  return (
    <>
      {
        NotHomePage && (
          <div className='mx-auto max-w-7xl px-10 pt-5 pb-5' style={{boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.15)'}}>
              <div className='ml-10 flex shrink-0 items-center w-full  '>
                <Link href={'/'}>
                    <Image src={logo} 
                              height={32}
                              width={200}
                              alt='logo' 
                              className='object-contain h-auto w-auto cursor-pointer'/>  
                </Link>
              </div>
          </div>
        )
      }
    </>
  )
}

export default Headers
