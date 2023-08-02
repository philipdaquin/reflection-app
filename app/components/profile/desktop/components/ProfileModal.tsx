import React, { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import {FaUser} from 'react-icons/fa'
import ChangeEmail from '../options/ChangeEmail'
import ChangePassword from '../options/ChangePassword'
function ProfileModal() {
    const {user, signOut} = useAuth()


    const head = 'text-[13px] text-[#424242]'
    const subhead = 'text-[#757575] text-[12px]'

    const [openToggle1, setOpenToggle1] = useState(true)
    const [openToggle2, setOpenToggle2] = useState(true)
    
    const toggle1 = () => {
      setOpenToggle1(!openToggle1)
      if (!openToggle2) {
        setOpenToggle2(true)
      }
    }
    const toggle2 = () => { 
      setOpenToggle2(!openToggle2)
      if (!openToggle1) {
        setOpenToggle1(true)
      }
    }


  return (
    <div className='w-[221px] relative items-start rounded-xl bg-white px-[10px] py-[10px] 
    flex flex-col' 
    style={{ boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.25)' }}>



      <div className='text-left space-y-3 w-full relative'>
        <div className='button !hover:bg-[#F5F5F5] cursor-pointer'>
          <label htmlFor="" onClick={toggle1} className='cursor-pointer' >
            <h1 className='text-[13px] text-[#424242]'>Change Email</h1>
            <p className='text-[#757575] text-[12px]'>{user?.email}</p>
          </label>
          <div className=' absolute z-[1] bottom-[114px] left-[227px]' hidden={openToggle1}>
            <ChangeEmail setOpenToggle1={setOpenToggle1}/>
          </div>
        </div>

        <div className='button !hover:bg-[#F5F5F5]'>
          <label htmlFor="" onClick={toggle2} className='cursor-pointer'>
            <h1 className={head}>Change Password</h1>
            <p className={subhead}>•••••••••</p>
          </label>

          {/* ChangePassword */}
          <div className='absolute z-[1] bottom-[54px] left-[227px]' hidden={openToggle2}>
            <ChangePassword setOpenToggle2={setOpenToggle2}/>
          </div>
        </div>

        <div className='h-[1px] bg-[#e0e0e0] w-full !hover:bg-[#F5F5F5]'>
        </div>
        <div className='button cursor-pointer' onClick={signOut}>
          <h1 className={head}>
            Log Out
          </h1>
        </div>
      </div>   
    </div>
  )
}

export default ProfileModal