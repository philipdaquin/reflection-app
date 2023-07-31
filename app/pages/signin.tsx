import Head from 'next/head'
import React, { useState } from 'react'
import Headers from '../layout/headers/Headers'
import {InformationCircleIcon} from '@heroicons/react/24/outline'
import {FcGoogle} from 'react-icons/fc'
import Link from 'next/link'
import TermsPrivacy from '../components/terms_and_privacy/TermsPrivacy'
import GenericButton, { GenericButtonVariant } from '../components/button/GenericButton'
import { Button } from '@mui/material'
import SocialsButton from '../components/button/SocialsButton'
import SmallDivider from './dividers/SmallDivider'
import { SubmitHandler, useForm } from 'react-hook-form'
import { error } from 'console'
import { LoginInput } from '../models/loginInput'
import useAuth from '../hooks/useAuth'



function signin() {

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<LoginInput>()


  const {signIn, signUp, googleSignin, error} = useAuth();

  const onSubmit: SubmitHandler<LoginInput> = async ({email, password}) => await signIn(email, password)

  const buttonVariant = (dirtyFields.email && dirtyFields.password) && !errors.email && !errors.password ? 
    GenericButtonVariant.FILLED : GenericButtonVariant.EMPTY 


  const googleProvider = async () => googleSignin()

  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className='flex flex-col py-10 justify-between h-full w-full items-center font-primary shrink-0'>
        
        <main className='w-[411px]'>
          <div className='text-center flex flex-col justify-center'>
            <div className='pt-5 pb-5 space-y-3.5'>
              <h1 className='font-semibold text-[35px] '>
                Welcome to Reflection
              </h1>
              <h3 className='text-[#757575] text-[17px]'>
                Transform your well-being with Reflection today.
              </h3>
            </div>


            <form action="" className='' onSubmit={handleSubmit(onSubmit)}>
              <label className='inline-block w-full space-y-1 h-[67px]'>
                <input type="email" 
                  placeholder='Email Address' 
                  className='input'
                  {...register('email', {required: true })}
                  />

                  {
                    errors.email && (

                      <p className='text-red-600 text-xs text-left'>
                        Please enter valid email address.
                      </p>


                    )
                  }

              </label>

              <label htmlFor="" className="inline-bkock w-full space-y-1 h-[67px]">
                <input type="password" 
                  placeholder='Password' 
                  className='input' 
                  {...register('password', {required: true })}
                />
                {
                 errors.password && (
                    <p className='text-red-600 text-xs text-left'>
                      Your password must contain between 4 and 60 characters.
                    </p>
                  )
                }
              </label>

              <Link href={"/password_reset"} className='cursor-pointer mt-3 inline-block w-full'>
                <h2 className='text-xs font-bold text-center hover:underline'>Forgot Password?</h2>
              </Link>
              


              <div className='mt-[40px] space-y-12'>

                  {
                    error && (
                      <div className='items-center space-x-2 flex flex-row justify-center'>
                        <InformationCircleIcon height={24} width={24} color='#FF0000'/>
                        <p className='text-red-600 text-sm font-semibold text-center'>
                          Please enter a valid password.
                        </p>
                      </div>


                    )
                  }

                <button className='w-full' type='submit'>
                  <GenericButton title='Sign in' variant={buttonVariant} />
                </button>

                <h1 className=' font-medium text-[#424242] text-[15px] text-center'>
                  Don't have an account yet? 
                    <span className='font-semibold underline cursor-pointer ml-1'>
                      <Link href="/onboarding/signup">
                        Sign up for free
                      </Link>
                    </span>
                </h1>
              </div>
            </form>
          </div>



          <div className='flex flex-col justify-center space-y-11 pt-10'>

            <SmallDivider />

            <button className='w-full' onClick={googleProvider}>
              <SocialsButton 
                icon={<FcGoogle size={25} className='relative right-[40px]'/>} 
                name='Continue with Google' 
              />
            </button>
          </div>
        </main>


        <TermsPrivacy />
      </div>
         

    </>
  )
}

export default signin