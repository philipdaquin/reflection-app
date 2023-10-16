import React from 'react'
import TermsPrivacy from '../../components/terms_and_privacy/TermsPrivacy'
import Link from 'next/link'
import Head from 'next/head'
import GenericButton, { GenericButtonVariant } from '../../components/button/GenericButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { SignUpInputs } from '../../models/user'
import useAuth from '../../hooks/useAuth'



function signup() {

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<SignUpInputs>()


  const {signIn, signUp} = useAuth();

  const onSubmit: SubmitHandler<SignUpInputs> = async ({email, password, firstName, lastName}) => await signUp(email, password)

  const buttonVariant = (dirtyFields.email && dirtyFields.password) && !errors.email && !errors.password ? 
    GenericButtonVariant.FILLED : GenericButtonVariant.EMPTY 


  return (

    <>
      <Head>
          <title>Hello John 👋</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='w-full  justify-between py-14  flex h-full flex-col items-center font-primary shrink-0'>
        <main className='space-y-4'>
          <section className='space-y-4'>
            <div className='text-center flex flex-col justify-center space-y-3.5'>
              <h1 className='font-semibold text-[35px] '>
                What is your name?
              </h1>
              <h3 className='text-[#757575] text-[17px]'>
                Create a new account and start your journey.
              </h3>
            </div>

            <form action="" className='' onSubmit={handleSubmit(onSubmit)}>
              
              <label htmlFor="" className='h-[67px] space-y-1'>
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
              
              <div className='flex flex-row w-full justify-between mt-5 mb-4 items-center space-x-3'>
                <label htmlFor="" className='space-y-1 flex flex-col justify-center'>
                  <input type="text" placeholder='First Name' className='input w-[190px]'/>
                  <p className='text-xs text-right text-[#757575]'>Optional</p>
                </label>  

                
                <div className='w-[2px] bg-[#bdbdbd] h-[19px] relative bottom-3'>
                </div>

                <label htmlFor="" className='space-y-1 flex flex-col justify-center'>
                  <input type="text" placeholder='Last Name' className='input w-[190px]'/>
                  <p className='text-xs text-right text-[#757575]'>Optional</p>
                </label>  

              </div>
              
              <label htmlFor="" className='h-[67px] space-y-1'>
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

              <div className='pt-[31px] space-y-5 mt-4'>
                <button className='w-full' type='submit'>
                      <GenericButton title='Continue' variant={buttonVariant} />
                </button>

                <h1 className=' font-medium text-[#424242] text-[16px] text-center'>
                  Already have an account? 
                    <span className='font-semibold underline cursor-pointer ml-1'>
                      <Link href="/signin">
                        Sign In
                      </Link>
                    </span>
                </h1>
              </div>
            </form>
          </section>
        </main>
        <TermsPrivacy />
      </div>
    </>
  )
}

export default signup