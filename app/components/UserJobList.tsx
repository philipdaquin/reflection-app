import React from 'react'
import {CheckIcon, XMarkIcon} from '@heroicons/react/20/solid'

interface Props { 
    title: string, 
    details: string
    isDone: boolean
}

function UserJobList({title, details, isDone}: Props) {
  return (
    <div className='flex flex-row space-x-[22px] items-center'>
        {
            !isDone && (
                <div className='rounded-full items-center flex justify-center w-9 h-9 bg-[#E84040]/40'>
                    <XMarkIcon height={17} width={17} color="#E84040" strokeWidth={1}/>
                </div>
            )
        }
        {
            isDone && (
                <div className='rounded-full items-center flex justify-center w-9 h-9 bg-[#78FF75]/40'>
                    <CheckIcon height={17} width={17} color="#1cc16a" strokeWidth={1}/>
                </div>
            )
        }
        <div className='flex flex-col -space-y-1'>
            <h1 className='text-left font-bold text-[17px] '>{title}</h1>
            <h3 className='text-left font-normal text-[14px] '>{details.slice(0, 45) + "..."}</h3>
        </div>
    </div>
  )
}

export default UserJobList