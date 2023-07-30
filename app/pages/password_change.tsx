import Head from 'next/head'
import React from 'react'
import GenericButton, { GenericButtonVariant } from '../components/button/GenericButton'

function password_change() {
  return (
    <>
        <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className='flex flex-col py-10 justify-between h-full w-full items-center font-primary shrink-0'>
        
        <main className='space-y-5 w-[411px]'>
          <div className='text-center flex flex-col justify-center space-y-3.5'>
            <h1 className='font-semibold text-[35px] '>
              Change your password
            </h1>
            <h3 className='text-[#757575] text-[17px]'>
              Your new password must be different from different previous used passwords.
            </h3>
          </div>


            <div className='w-full py-[17px] bg-[#edeff3] rounded-xl px-3'>
              <input type="password" placeholder='Password' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
            </div>

            <div className='w-full py-[17px] bg-[#edeff3] rounded-xl px-3'>
              <input type="password" placeholder='Re-enter your password' className='outline-none text-[#757575] text-[17px] bg-inherit w-full'/>
            </div>



          <div className='pt-[50px] space-y-12'>

            <div>
              <GenericButton title='Change password' variant={GenericButtonVariant.FILLED} />
            </div>


            </div>
            </main>
          </div>  
    </>
  )
}

export default password_change