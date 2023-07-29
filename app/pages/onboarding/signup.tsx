import React from 'react'
import TermsPrivacy from '../../components/terms_and_privacy/TermsPrivacy'
import Link from 'next/link'
import Head from 'next/head'

function signup() {
  return (

    <>
      <Head>
          <title>Hello John 👋</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='w-full flex h-screen flex-col justify-center items-center font-primary shrink-0'>
      <main className='pt-14'>
            <div className='text-center flex flex-col justify-center space-y-3.5'>
              <h1 className='font-semibold text-[35px] '>
                What is your name?
              </h1>
              <h3 className='text-[#757575] text-[17px]'>
                Create a new account and start your journey.
              </h3>
            </div>

            <div className='space-y-5 pt-[49px]'>
              <div className='w-[411px] py-6 bg-[#edeff3] rounded-xl px-3'>
                <input type="email" placeholder='Email Address' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
              </div>

              <div className='flex flex-row justify-between items-center'>
                <div className='w-[190px] py-6 bg-[#edeff3] rounded-xl px-3'>
                  <input type="text" placeholder='First Name' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
                </div>

                <div className='w-[2px] bg-[#bdbdbd] h-[19px]'>
                </div>

                <div className='w-[190px] py-6 bg-[#edeff3] rounded-xl px-3'>
                  <input type="text" placeholder='Last Name' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
                </div>
              </div>
            </div>


            <div className='pt-[33px] space-y-12'>
              <div className=' py-4 w-full items-center flex flex-row justify-center bg-[#212121] rounded-[25px]'>
                <h1 className='font-semibold text-[16px] text-white'> 
                  Continue
                </h1>
              </div>

              <h1 className=' font-medium text-[#424242] text-[16px] text-center'>
                Already have an account? 
                  <span className='font-semibold underline cursor-pointer'>
                    <Link href="/signin">
                      Sign In
                    </Link>
                  </span>
              </h1>
            </div>
          </main>
        <TermsPrivacy />
      </div>

    </>



  )
}

export default signup