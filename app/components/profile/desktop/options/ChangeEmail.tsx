import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import GenericButton, { GenericButtonVariant } from '../../../button/GenericButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../../../../hooks/useAuth'
import {EnvelopeIcon} from '@heroicons/react/24/outline'

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
}

function ChangeEmail() {
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors, dirtyFields },
      } = useForm<NewEmailInput>()


    const { changeEmail, emailChangeConfirmation, user
    } = useAuth()

    // Get the email 
    const onSubmit: SubmitHandler<NewEmailInput> = async ({newEmail}) =>{
        if (!user || !newEmail) return

        await changeEmail(user, newEmail)
    }

    const buttonVariant = (dirtyFields.newEmail ) && !errors.newEmail ? 
      GenericButtonVariant.FILLED : GenericButtonVariant.EMPTY 
    
  return (
    <>
        {
            emailChangeConfirmation && user?.email ? (
                <EmailConfirmation email={user?.email}/>
            ) : (
                <div className='w-[331px] items-start rounded-[20px] bg-white px-[19px] py-[21px] 
                flex flex-col' 
                style={{ boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.25)' }}>

                <div className='flex flex-col space-y-2 w-full pb-3'>
                    <div className='items-center flex flex-row justify-between'>
                        <h1 className='font-semibold text-[14px] text-left'>Change your email</h1>
                        <div className='bg-[#F5F5F5] p-[9px] rounded-full cursor-pointer button !hover:bg-[#E0E0E0]'>
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
                                        placeholder='Email Address' 
                                        className='input !py-[13px] !text-[13px] placeholder:text-[13px]'
                                        {...register('newEmail', {required: true })}
                                        />
                                        {/* {
                                        errors.newEmail && (
                                        )
                                        } */}
                                            <p className='text-red-600 text-xs text-left'>
                                            Please enter valid email address.
                                            </p>
                                </label>              
                                {/* <label className='inline-block w-full space-y-1'>
                                    <input type="password" 
                                        placeholder='Current Password' 
                                        className='input py-[13px] !text-[13px]  placeholder:text-[13px]'
                                        {...register('currentPassword', {required: true })}
                                        />
                                        {
                                        errors.currentPassword && (
                                            <p className='text-red-600 text-[10px] text-left'>
                                            Please enter valid email address.
                                            </p>
                                        )
                                        }
                                </label>               */}
                            </div>
                                
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