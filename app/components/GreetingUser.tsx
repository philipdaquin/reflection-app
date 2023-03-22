import Image from 'next/image'
import React from 'react'

const IMAGE_URL: string = 'https://www.telegraph.co.uk/content/dam/news/2021/06/04/UFO_trans_NvBQzQNjv4BqECnBSB4T3tw7hRvCORLehcLZq-j_VIcNfiYtpwBx7zI.jpg?imwidth=680'

function GreetingUser() {
    return (

        <div className='flex justify-between items-center'>
            <div className='text-left font-semibold text-[32px]'>
                Hello John👋
            </div>
            <Image src={IMAGE_URL} 
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