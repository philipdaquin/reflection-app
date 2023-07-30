import Head from 'next/head'
import React from 'react'
import {CheckIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import {HiCheck} from 'react-icons/hi'
import GenericButton, { GenericButtonVariant } from '../components/button/GenericButton'
function password_success() {
  return (
    <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className='flex flex-col  relative py-14 justify-center h-screen w-full items-center font-primary shrink-0'>
            <section className='w-[411px] h-full items-center justify-center flex flex-col'>
                <div className='p-4 items-center w-fit flex flex-row justify-center rounded-full bg-[#56bb70]'>
                    <HiCheck size={76} color='white'/>
                </div>
                
                <div className='text-center pt-[52px]  flex flex-col justify-center space-y-3.5'>
                    <h1 className='font-semibold text-[35px] '>
                        You've set a new password
                    </h1>
                    <h3 className='text-[#757575] text-[17px]'>
                        Now let's get you back to your account.
                    </h3>
                </div>
                <div className='w-full mt-[54px]'>
                    <Link href={'/signin'}>
                        <GenericButton title='Continue to login page' variant={GenericButtonVariant.FILLED}/>
                    </Link>
                </div>
            </section>
            
        </div>
    </>
  )
}

export default password_success