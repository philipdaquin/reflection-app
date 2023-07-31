import Head from 'next/head'
import React from 'react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import GenericButton, { GenericButtonVariant } from '../components/button/GenericButton'

function CheckEmail() {
  return (
    <section className='w-[411px] space-y-10'>
      <div className='text-center flex flex-col justify-center space-y-3.5'>
        <h1 className='font-semibold text-[35px] '>
          Check your email
        </h1>
        <h3 className='text-[#757575] text-[17px]'>
          We sent an email to <span className='font-semibold'>john@appleseed.com</span>
        </h3>
        <h3 className='text-[#757575] text-[17px] pt-8'>
          Please check your inbox and click the received link to reset a password.
        </h3>
      </div>
      
      <div>
        <Link href={'/signin'}>
          <GenericButton title='Back to login' variant={GenericButtonVariant.FILLED}/>
        </Link>
      </div>
    </section>
  )
}

function ResetPassword() { 
  return (
    <section className='space-y-10 w-[411px]'>
      <Link href={'/signin'} className=''>
        <div className='items-center space-x-1 flex flex-row rounded-full hover:bg-[#EEEEEE] w-fit transition-colors duration-400 '>
          <XMarkIcon height={32} width={32} color='#424242'/>
          {/* <p className='text-sm font-semibold'>Back</p> */}
        </div>
      </Link>
      <div className='text-center flex flex-col justify-center space-y-3.5'>
        <h1 className='font-semibold text-[35px] '>
          Reset password
        </h1>
        <h3 className='text-[#757575] text-[17px]'>
          Please enter your email address to request a password reset.
        </h3>
        <div className='w-full py-[17px] bg-[#edeff3] rounded-xl px-3'>
          <input type="email" placeholder='Email Address' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
        </div>
      </div>

      <div className=' py-4 w-full items-center flex flex-row justify-center bg-[#212121] rounded-[25px]'>
        <h1 className='font-semibold text-[16px] text-white'>
          Send password reset link
        </h1>
      </div>
    </section>
  )
}

function password_reset() {
  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      


      <div className='flex flex-col relative py-10 justify-between h-full w-full items-center font-primary shrink-0'>
      
      {/* <ResetPassword />   */}
      <CheckEmail />

      </div>
         
    </>
  )
}

export default password_reset