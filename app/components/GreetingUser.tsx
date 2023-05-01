import Image from 'next/image'
import React from 'react'
import { DEFAULT_IMAGE_URL } from '../typings'


function GreetingUser() {
    return (

        <div className='flex justify-between items-center'>
            <div className='text-left font-semibold text-[32px]'>
                Hello John👋
            </div>
            <Image src={DEFAULT_IMAGE_URL} 
                className='rounded-full object-fill w-[38px] h-[38px]' 
                alt='User Profile'  
                height={38}
                width={38}
                quality={100}
            />  
        </div>
    )
}

export default GreetingUser