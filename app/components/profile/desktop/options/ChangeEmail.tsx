import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import GenericButton, { GenericButtonVariant } from '../../../button/GenericButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../../../../hooks/useAuth'
import {EnvelopeIcon} from '@heroicons/react/24/outline'
import { auth } from '../../../../firebase'
import { getAuth } from 'firebase/auth'

interface ConfirmationEmail { 
    email: string
}
export function EmailConfirmation({email}: ConfirmationEmail) { 
    return (
        <div className='w-[331px] items-center rounded-[20px] bg-white px-[19px] pt-[32px] pb-[36px]
        flex flex-col' 
        style={{ boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.25)' }}>
            <div className='w-full items-center flex flex-col justify-center'>
                <div className='rounded-full w-fit items-center flex flex-row justify-center bg-[#212121] p-[10px]'>
                    <EnvelopeIcon height={30} width={30} color='white'/>
                </div>

                <div className='w-full space-y-2.5 text-center pt-[14px] flex flex-col'>
                    <h1 className='font-semibold text-[15px] text-center'>
                        Confirmation Required
                    </h1>
                    <p className='text-[#757575] text-[12px] '>
                        We've sent a confirmation email to <span className='font-bold'>{email}</span>. Click the link to 
                        verify this change. 
                    </p>
                </div>
            </div>
        </div>
    )
}


interface NewEmailInput { 
    newEmail: string, 
    password: string
}

interface Props { 
    setOpenToggle1: any
}

function ChangeEmail({setOpenToggle1}: Props) {
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setError,
        formState: { errors, dirtyFields },
        clearErrors
      } = useForm<NewEmailInput>()


    const { changeEmail, emailChangeConfirmation, user
    } = useAuth()
    const [currentEmail, setCurrentEmail] = useState<string | null>('')

    // Get the email 
    const onSubmit: SubmitHandler<NewEmailInput> = async ({newEmail, password}) =>{
        if (!user || !newEmail) return

        if (user?.email === newEmail) {
            setError("newEmail" , {
            type: "custom",
            message: "You can't use the same email address." })
            
            return
        }
        setCurrentEmail(user?.email || '')
        await changeEmail(user, newEmail, password)

        clearErrors("newEmail")

    }


    const buttonVariant = (dirtyFields.newEmail && dirtyFields.password ) && !errors.newEmail && !errors.password ? 
      GenericButtonVariant.FILLED : GenericButtonVariant.EMPTY 
    

    const close = () => setOpenToggle1(true)

  return (
    <>
        {
            emailChangeConfirmation && currentEmail ? (
                <EmailConfirmation email={currentEmail}/>
            ) : (
                <div className='w-[331px] items-start rounded-[20px] bg-white px-[19px] py-[21px] 
                flex flex-col' 
                style={{ boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.25)' }}>

                <div className='flex flex-col space-y-2 w-full pb-3'>
                    <div className='items-center flex flex-row justify-between'>
                        <h1 className='font-semibold text-[14px] text-left text-black'>Change your email</h1>
                        <div onClick={close} className='bg-[#F5F5F5] p-[9px] rounded-full cursor-pointer button !hover:bg-[#E0E0E0]'>
                            <XMarkIcon height={12} width={12} color='#9E9E9E' strokeWidth={2}/>
                        </div>
                    </div>
                    <p className='text-[12px] text-[#757575]'>An email will be sent to your original email address to verify the change.</p>
                </div>

                <div className='flex flex-col space-y-2.5 w-full'>
                    <div className='h-[1px] bg-[#e0e0e0] w-full mb-2'></div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className='text-center flex flex-col text-[13px] justify-center space-y-3.5'>
                                <label className='inline-block w-full space-y-2'>
                                    <input type="email" 
                                        placeholder='New Email Address' 
                                        className='input !py-[13px] !text-[13px] placeholder:text-[13px]'
                                        {...register('newEmail', {required: true })}
                                        />
                                        {
                                        errors.newEmail && (
                                                <p className='text-red-600 text-xs text-left'>
                                                Email already in use. Try again.
                                                </p>
                                            )
                                        }
                                </label>              
                                <label className='inline-block w-full space-y-1'>
                                    <input type="password" 
                                        placeholder='Current Password' 
                                        className='input py-[13px] !text-[13px]  placeholder:text-[13px]'
                                        {...register('password', {required: true })}
                                        />
                                        {
                                        errors.password && (
                                            <p className='text-red-600 text-[10px] text-left'>
                                            Please enter your password.
                                            </p>
                                        )
                                        }
                                </label>              
                            </div>
                            {errors.root?.message}
                            {
                                errors.root?.message && (
                                    <p className='text-red-600 text-[10px] text-left'>
                                        {errors.root?.message}
                                    </p>
                                )
                            }
                            
                                
                            <button className='w-full mt-[25px] !rounded-non ' type='submit'>
                                <GenericButton title='Save Changes' variant={buttonVariant} />
                            </button>
                        </form>
                </div>

                </div>
            )
        }

    </>
  )
}

export default ChangeEmail