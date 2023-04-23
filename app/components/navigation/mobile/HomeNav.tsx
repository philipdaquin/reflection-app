import React, { useState } from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon, CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline'
import {RiChatVoiceLine} from 'react-icons/ri'
import NavButton from './NavButton'


function HomeNav() {
    const [toggle, setToggle] = useState(false)

    const openToggle = () => { 
      setToggle(!toggle)
    }

  return (
    <div className='flex flex-row space-x-9 '>
        <NavButton 
            routerName=''
            icon={<HomeIcon height={24} width={24} color="black"/>}/>
       <NavButton 
          routerName='weekly_calendar'
          icon={<CalendarDaysIcon height={24} width={24} color="white"/>}/>
        
        <div onClick={openToggle} className='bg-[#424242] rounded-full p-2 cursor-pointer'>
          <PlusIcon height={24} width={24} color="white"/>
        </div>

        {
          toggle && (
            <div className='space-y-3'>
              {/* <NavButton 
                routerName='chat'
                icon={<RiChatVoiceLine size={24} color="white"/>}/>
              <NavButton 
                routerName='record'
                icon={
                    <MicrophoneIcon height={24} width={24} color="white"/>
                    }/> */}
            
            </div>
          )
        }
        
        
        <NavButton 
            routerName='playlist'
            icon={<MusicalNoteIcon height={24} width={24} color="black"/>}/>
   </div>
  )
}

export default HomeNav