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
import { HiChartBar, HiOutlineClipboardList, HiOutlineCollection, HiViewGrid } from 'react-icons/hi'
import { useRecoilState } from 'recoil'
import { AddEntryToggle } from '../../../atoms/atoms'
import { useRouter } from 'next/router'
import { BsCollection, BsFillCollectionFill, BsSuitHeartFill } from 'react-icons/bs'
import { MdOutlineReceiptLong } from 'react-icons/md'


function HomeNav() {
    const [toggle, setToggle] = useState(false)

    const [showModal, setShowModal] = useRecoilState(AddEntryToggle);
    const openToggle = () => { 
      setShowModal(!showModal)
    }

    const router = useRouter()
    
    // const colour = `${router.pathname === routerName ? '' : ''}`

    return (
      <div className='flex flex-row sm:space-x-7 px-[22px] sm:justify-center justify-between '>
          <NavButton 
              routerName=''
              title='Summary'
              icon={<BsSuitHeartFill size={33} color='#000'/>}/>
          <NavButton 
            routerName='weekly_calendar'
            title='Plans'

            icon={<MdOutlineReceiptLong size={33} color='#000'/>}/>
          
          <div onClick={openToggle} className='bg-[#000] relative bottom-[39px] ring-[4px] ring-white rounded-full p-[10px] cursor-pointer'>
            <PlusIcon height={30} width={30} color="white"/>
          </div>
      
          <NavButton 
              routerName='playlist'
              title='Insights'

              icon={<HiChartBar size={33} color='#000'/>}/>
          <NavButton 
              routerName='collections'
              title='Library'

              icon={<HiViewGrid size={33} color='#000'/>}/>
    </div>
    )
}

export default HomeNav