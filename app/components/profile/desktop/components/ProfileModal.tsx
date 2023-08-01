import React from 'react'
import useAuth from '../../../../hooks/useAuth'
import {FaUser} from 'react-icons/fa'
function ProfileModal() {
    const {user, signOut} = useAuth()


    const head = 'text-[13px] text-[#424242]'
    const subhead = 'text-[#757575] text-[12px]'

    


  return (
    <div className='w-[221px] items-start rounded-xl bg-white px-[10px] py-[10px] 
    flex flex-col' 
    style={{ boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.25)' }}>


      <div className='text-left space-y-3 w-full'>
        <div className='button'>
          <h1 className='text-[13px] text-[#424242]'>Change Email</h1>
          <p className='text-[#757575] text-[12px]'>john@appleseed.com</p>
        </div>

        <div className='button'>
          <h1 className={head}>Change Password</h1>
          <p className={subhead}>•••••••••</p>
        </div>

        <div className='h-[1px] bg-[#e0e0e0] w-full'>
        </div>
        <div className='button' onClick={signOut}>
          <h1 className={head}>
            Log Out
          </h1>
        </div>
      </div>   


    </div>
  )
}

export default ProfileModal