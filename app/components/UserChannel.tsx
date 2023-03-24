import Image from 'next/image'
import React from 'react'

const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'

interface Props { 
  userImg: string, 
  userName: string
}

function UserChannel({userImg, userName}: Props) {
  return (
    <div className='flex flex-col items-center space-y-4'>
         <Image src={userImg} 
              className='rounded-[50px] object-fill border-[#F6F6F6] border-8 h-[156px] w-[156px]' 
              alt='User Profile'  
              height={156}
              width={156}
              quality={100}
          />  
          <h1 className='font-medium text-center text-[#424242]'>{userName}</h1>
    </div>
  )
}

export default UserChannel