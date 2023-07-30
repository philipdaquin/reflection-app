import Head from 'next/head'
import React from 'react'
import Headers from '../../layout/headers/Headers'
import TermsPrivacy from '../../components/terms_and_privacy/TermsPrivacy'
import Link from 'next/link'

function verification() {
  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-col py-14 justify-between h-full w-full items-center font-primary shrink-0'>
        
        <main className='space-y-5 w-[411px]'>
          <div className='text-center flex flex-col justify-between space-y-10'>
            
            <div>
              <h1 className='font-semibold text-[35px] '>
                Verify your email
              </h1>
              <h3 className='text-[#757575] text-[17px]'>
                Enter below the verification code to verify your email address on:
              </h3>
            </div>

            <h1 className='text-[23px] font-semibold text-center text-black'>
              john@appleseed.com
            </h1>

            <div className='space-y-[35px] pt-4'>
              <div className='w-[411px] py-[17px] bg-[#edeff3] rounded-xl px-3'>
                <input type="text" placeholder='Verification Code' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
              </div>
            
              <div className='space-y-6'>
                <div className=' py-4 w-full items-center flex flex-row justify-center bg-[#212121] rounded-[25px]'>
                  <h1 className='font-semibold text-[16px] text-white'>
                    Continue
                  </h1>
                </div>

                <h1 className=' font-medium text-[#757575] text-[13px] text-center'>
                  Didn't receive the code? 
                    <span className='font-semibold underline cursor-pointer ml-1'>
                      <Link href="/onboarding/signup">
                        Resend code
                      </Link>
                    </span>
                </h1>
              </div>
            </div>
          </div>
        </main>


        <TermsPrivacy />
      </div>
         



    
    </>
  )
}

export default verification