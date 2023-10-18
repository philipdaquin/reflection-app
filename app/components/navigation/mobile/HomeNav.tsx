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


type NavObject = { 
  routeName: string,
  title: string, 
  icon: any
}

function HomeNav() {
    const [toggle, setToggle] = useState(false)

    const [showModal, setShowModal] = useRecoilState(AddEntryToggle);
    const openToggle = () => { 
      setShowModal(!showModal)
    }

    
    let navList: NavObject[] = [
      {
        routeName: '',
        title: 'Summary',
        icon: <BsSuitHeartFill size={33} color='#000'/>
      },
      {
        routeName: 'weekly_calendar',
        title: 'Plans',
        icon: <MdOutlineReceiptLong size={33} color='#000'/>
      },
      {
        routeName: 'mood_summary',
        title: 'Insights',
        icon: <HiChartBar size={33} color='#000'/>
      },
      {
        routeName: 'collections',
        title: 'Library',
        icon: <HiViewGrid size={33} color='#000'/>
      },

    ]

    const router = useRouter()
    const colour = (routeName: string) => {
      return `${router.pathname === routeName ? '#000' : '#757575'}`
    }
    

    return (
      <div className='flex flex-row sm:space-x-7 px-[22px] sm:justify-center justify-between '>
          <NavButton 
              routerName=''
              title='Summary'
              icon={<BsSuitHeartFill size={33} color={colour('/')}/>}/>
          <NavButton 
            routerName='weekly_calendar'
            title='Plans'

            icon={<MdOutlineReceiptLong size={33} color={colour('/weekly_calendar')}/>}/>
          
          <div onClick={openToggle} className='bg-[#000] relative bottom-[39px] px-[14px] rounded-full items-center flex flex-row justify-center cursor-pointer'>
            <PlusIcon height={30} width={30} color="white"/>
          </div>
      
          <NavButton 
              routerName='mood_summary'
              title='Insights'

              icon={<HiChartBar size={33} color={colour('/mood_summary')}/>}/>
          <NavButton 
              routerName='collections'
              title='Library'

              icon={<HiViewGrid size={33} color={colour('/collections')}/>}/>
    </div>
    )
}

export default HomeNav