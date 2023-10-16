import React from 'react'
import useAuth from '../../../../hooks/useAuth'
import { FaUser } from 'react-icons/fa'

function ProfileButton() {
    const {user} = useAuth()

    return (
      <div className='space-x-3 w-full p-2 cursor-pointer hover:bg-[#eaeaea] flex flex-row items-center duration-200 ease-in-out transition-colors rounded-md'>
          <div className=''>
              <FaUser size={13} color='#757575'/>
          </div>
          <h1 className='text-[#757575]  flex-row  text-left text-[12px]'>{user?.email}</h1>
      </div>
  )
}

export default ProfileButton