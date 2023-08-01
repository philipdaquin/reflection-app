import Head from 'next/head'
import React, { useState } from 'react'
import {InformationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import GenericButton, { GenericButtonVariant } from '../components/button/GenericButton'
import useAuth from '../hooks/useAuth'
import { SubmitHandler, useForm } from 'react-hook-form'


interface CheckEmailProps { 
  email: string
}
function CheckEmail({email}: CheckEmailProps) {
  return (
    <section className='w-[411px] space-y-10'>
      <div className='text-center flex flex-col justify-center space-y-3.5'>
        <h1 className='font-semibold text-[35px] '>
          Check your email
        </h1>
        <h3 className='text-[#212121] text-[17px]'>
          We sent an email to <span className='font-semibold'>{email}</span>
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


// interface ResetProps { 
//   onSubmit: SubmitHandler<ResetInput>,
//   buttonVariant: GenericButtonVariant
// }

// function ResetPassword({onSubmit, buttonVariant}: ResetProps) { 

//   return (
//     <section className='space-y-10 w-[411px]'>
//       <Link href={'/signin'} className=''>
//         <div className='items-center flex flex-row rounded-full !button !px-1 !py-1 w-fit'>
//           <XMarkIcon height={32} width={32} color='#757575'/>
//           {/* <p className='text-sm font-semibold'>Back</p> */}
//         </div>
//       </Link>
//       <form action="" onSubmit={handleSubmit(onSubmit)}>
//         <div className='text-center flex flex-col justify-center space-y-3.5'>
//           <h1 className='font-semibold text-[35px] '>
//             Reset password
//           </h1>
//           <h3 className='text-[#757575] text-[17px]'>
//             Please enter your email address to request a password reset.
//           </h3>

//           <input type="email" placeholder='Email Address' className='input'/>
//         </div>
//           <div className=' py-4 w-full items-center flex flex-row justify-center bg-[#212121] rounded-[25px]'>
//             <h1 className='font-semibold text-[16px] text-white'>
//               Send password reset link
//             </h1>
//           </div>
          
//           <button className='w-full' type='submit'>
//             <GenericButton title='Send password reset link' variant={buttonVariant} />
//           </button>
//       </form>
//     </section>
//   )
// }

interface ResetInput {
  email: string
}


function password_reset() {

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<ResetInput>()

  const {passwordReset, passwordResetSuccess,
    passwordResetEmailSend, error
  } = useAuth()

  // Get the email 
  const onSubmit: SubmitHandler<ResetInput> = async ({email}) => await passwordReset(email)

  const buttonVariant = (dirtyFields.email) && !errors.email ? 
    GenericButtonVariant.FILLED : GenericButtonVariant.EMPTY 


  const [confirmedEmail, ] = useState(getValues("email"))
  // After success, Check Email
  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      


      <div className='flex flex-col relative py-10 justify-between h-full w-full items-center font-primary shrink-0'>
      

      {
        passwordResetEmailSend ? (
          <CheckEmail email={getValues("email")}/>

        ) : (
          <section className='space-y-10 w-[411px]'>
          
          
          
            <Link href={'/signin'} className=''>
              <div className='items-center flex flex-row rounded-full !button !px-1 !py-1 w-fit'>
                <XMarkIcon height={32} width={32} color='#757575'/>
                {/* <p className='text-sm font-semibold'>Back</p> */}
              </div>
            </Link>
            
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className='text-center flex flex-col justify-center space-y-3.5'>
                <h1 className='font-semibold text-[35px] '>
                  Reset password
                </h1>
                <h3 className='text-[#757575] text-[17px]'>
                  Please enter your email address to request a password reset.
                </h3>

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
              </div>
              {
                    error && (
                      <div className='items-center space-x-2 flex flex-row justify-center'>
                        <InformationCircleIcon height={24} width={24} color='#FF0000'/>
                        <p className='text-red-600 text-sm font-semibold text-center'>
                            Unable to find user.
                        </p>
                      </div>


                    )
                  }
              <button className='w-full mt-[50px]' type='submit'>
                <GenericButton title='Send password reset link' variant={buttonVariant} />
              </button>
            
            </form>
          </section>
        )
      }

      </div>
         
    </>
  )
}

export default password_reset