import React, { useState } from 'react'
import {
  HomeIcon, 
  MagnifyingGlassIcon, 
  MicrophoneIcon, 
  UserIcon, 
  MusicalNoteIcon, 
  CalendarDaysIcon,
  ClipboardIcon ,
  PlusIcon 
} from '@heroicons/react/24/outline'
import {RiChatVoiceLine} from 'react-icons/ri'
import NavButton from './NavButton'
import AddEntryContent from './AddEntryContent'
import { HiOutlineClipboardList, HiOutlineCollection } from 'react-icons/hi'
import { useRecoilState } from 'recoil'
import { AddEntryToggle } from '../../../atoms/atoms'
import { useRouter } from 'next/router'
import { BsCollection, BsFillCollectionFill } from 'react-icons/bs'


function HomeNav() {
    const [toggle, setToggle] = useState(false)

    const [showModal, setShowModal] = useRecoilState(AddEntryToggle);
    const openToggle = () => { 
      setShowModal(!showModal)
    }

    const router = useRouter()
    
    // const colour = `${router.pathname === routerName ? '' : ''}`

    return (
      <div className='flex flex-row sm:space-x-7 px-4 sm:justify-center justify-between '>
          <NavButton 
              routerName=''
              icon={<HomeIcon height={24} width={24} color="black"/>}/>
          <NavButton 
            routerName='weekly_calendar'
            icon={<CalendarDaysIcon height={24} width={24} color="black"/>}/>
          
          <div onClick={openToggle} className='bg-[#000] rounded-full p-2 cursor-pointer'>
            <PlusIcon height={24} width={24} color="white"/>
          </div>
      
          <NavButton 
              routerName='playlist'
              icon={<HiOutlineClipboardList size={24} color="black"/>}/>
          <NavButton 
              routerName='collections'
              icon={<HiOutlineCollection size={24} color="black"/>}/>
    </div>
    )
}

export default HomeNav