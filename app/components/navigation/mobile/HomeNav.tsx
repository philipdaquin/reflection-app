import React from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import {RiChatVoiceLine} from 'react-icons/ri'
import NavButton from './NavButton'


function HomeNav() {
  return (
    <div className='flex flex-row space-x-9 '>
        <NavButton 
            routerName=''
            icon={<HomeIcon height={24} width={24} color="black"/>}/>
        <NavButton 
            routerName='chat'
            icon={<RiChatVoiceLine size={24} color="black"/>}/>
        <NavButton 
            routerName='record'
            icon={<MicrophoneIcon height={24} width={24} color="black"/>}/>
        <NavButton 
            routerName='playlist'
            icon={<MusicalNoteIcon height={24} width={24} color="black"/>}/>
   </div>
  )
}

export default HomeNav