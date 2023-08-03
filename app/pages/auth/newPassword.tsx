import Head from 'next/head'
import React, { useEffect } from 'react'
import GenericButton, { GenericButtonVariant } from '../../components/button/GenericButton'
import Link from 'next/link'
import { HiCheck } from 'react-icons/hi'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../../hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { InformationCircleIcon } from '@heroicons/react/24/outline'


function PasswordChangeSuccess() {
  return (
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
  )
} 

interface PasswordChange { 
  oobCode: string, 
  newPassword: string, 
  confirmPassword: string
}


function newPassword() {

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    resetField,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<PasswordChange>()

  const {confirmPasswordReset, passwordResetSuccess
  } = useAuth()


  const searchParams = useSearchParams()
 
  const oobCode: string | null = searchParams.get('oobCode')

  useEffect(() => {
      if (oobCode) {
        setValue('oobCode', oobCode)
      }
  }, [oobCode])

  // Get the email 
  const onSubmit: SubmitHandler<PasswordChange> = async ({oobCode, newPassword, confirmPassword}) => {
    
    if (newPassword !== confirmPassword) {
      alert("Passwords did not match")
      return 
    } 

    await confirmPasswordReset(oobCode, confirmPassword)  
  }

  const buttonVariant = (dirtyFields.newPassword && dirtyFields.confirmPassword) && !errors.newPassword && !errors.confirmPassword ? 
    GenericButtonVariant.FILLED : GenericButtonVariant.EMPTY 


  return (
    <>
        <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {
        passwordResetSuccess ? (
          <PasswordChangeSuccess />
        ) : (
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

              <form action="" onSubmit={handleSubmit(onSubmit)}>

              <label className='inline-block w-full space-y-1 h-[67px]'>
                      <input type="password" 
                        placeholder='New Password' 
                        className='input'
                        {...register('newPassword', {required: true })}
                        />

                        {
                          errors.newPassword && (

                            <p className='text-red-600 text-xs text-left'>
                            Your password must contain between 4 and 60 characters.
                            </p>

                          )
                        }

                    </label>         
                    <label className='inline-block w-full space-y-1 h-[67px]'>
                      <input type="password" 
                        placeholder='Re-enter your password' 
                        className='input'
                        {...register('confirmPassword', {required: true })}
                        />

                        {
                          errors.confirmPassword && (

                            <p className='text-red-600 text-xs text-left'>
                            Your password must contain between 4 and 60 characters.
                            </p>

                          )
                        }

                    </label>         

                    <div className='mt-[50px] space-y-12'>

                      {
                        getValues('newPassword') !== getValues('confirmPassword') && (
                          <div className='items-center space-x-2 flex flex-row justify-center'>
                            <InformationCircleIcon height={24} width={24} color='#FF0000'/>
                            <p className='text-red-600 text-sm font-semibold text-center'>
                              Passwords do not match.
                            </p>
                          </div>
                        )
                      }

                      <button className='w-full' type='submit'>
                        <GenericButton title='Change password' variant={buttonVariant} />
                      </button>
                    </div>
                </form>

            </main>
          </div>  
        )
      }
    </>
  )
}


function changeEmail() { 
  return (
    <>
    </>
  )
}

/*
  if mode === recoverEmail { 
    changeEmail 
  } 


  if mode === recoverPassword {
    changePassword 
  }
  if mode === verifyAndChangeEmail {
    verifyAndChangeEmail 
  }

*/
function updateUserDetails() {
  const searchParams = useSearchParams()
 
  const mode: string | null = searchParams.get('mode')


  return (
    <>
    </>
  )

}


export default newPassword