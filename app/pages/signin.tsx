import Head from 'next/head'
import React from 'react'
import Headers from '../layout/headers/Headers'

import {FcGoogle} from 'react-icons/fc'
import Link from 'next/link'
import TermsPrivacy from '../components/terms_and_privacy/TermsPrivacy'


function signin() {
  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className='flex flex-col w-full justify-center items-center font-primary shrink-0'>
        
        <main className='pt-14'>

          <div className='text-center flex flex-col justify-center space-y-3.5'>
            <h1 className='font-semibold text-[35px] '>
              Welcome to Reflection
            </h1>
            <h3 className='text-[#757575] text-[17px]'>
              Transform your well-being with Reflection today.
            </h3>
          </div>

          <div className='space-y-5 pt-[49px]'>
            <div className='w-[411px] py-6 bg-[#edeff3] rounded-xl px-3'>
              <input type="email" placeholder='Email Address' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
            </div>


            <div className='flex flex-col justify-center space-y-5'>
              <div className='w-[411px] py-6 bg-[#edeff3] rounded-xl px-3'>
                <input type="password" placeholder='Password' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
              </div>
              <h2 className='text-xs font-bold text-center'>Forgot Password?</h2>
            </div>
          </div>


          <div className='pt-[33px] space-y-12'>
            <div className=' py-4 w-full items-center flex flex-row justify-center bg-[#212121] rounded-[25px]'>
              <h1 className='font-semibold text-[16px] text-white'>
                Sign in
              </h1>
            </div>

            <h1 className=' font-medium text-[#424242] text-[16px] text-center'>
              Don't have an account yet? 
                <span className='font-semibold underline cursor-pointer'>
                  <Link href="/onboarding/signup">
                    Sign up for free
                  </Link>
                </span>
            </h1>
          </div>



          <div className='flex flex-col justify-center space-y-11 pt-10'>

            <div className='flex flex-row items-center w-full justify-between px-[34px]'>
              <div className='h-[1px] w-[129px] bg-[#e0e0e0]'>
              </div>

              <h1 className='text-sm font-bold text-center text-[#757575]'>
                OR
              </h1>

              <div className='h-[1px] w-[129px] bg-[#e0e0e0]'>
              </div>
            </div>

            <div className=' py-4 w-full items-center flex flex-row justify-center bg-[#f5f5f5] rounded-[25px]'>
                <FcGoogle size={25} className='relative right-[40px]'/>
                <h1 className='font-medium text-[16px] text-center text-black justify-center flex flex-row'>
                  Continue with Google
                </h1>
            </div>
          </div>
        </main>
        <TermsPrivacy />
      </div>
         

    </>
  )
}

export default signin