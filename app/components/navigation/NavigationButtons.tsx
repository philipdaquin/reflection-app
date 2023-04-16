import React from 'react'
import {HomeIcon, MagnifyingGlassIcon, MicrophoneIcon, UserIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import {RiChatVoiceLine} from 'react-icons/ri'
import Link from 'next/link'

interface Props { 
  icon: any
  routerName: string
}

function Button({icon, routerName}: Props) { 
    return (
        <Link href={`/${routerName}`} className='cursor-pointer'>
          <div className='bg-[#424242] rounded-full p-2 cursor-pointer'>
            {icon}
          </div>
        </Link>
    )
}


function NavigationButtons() {
    return (
      // <div className='flex flex-col space-y-3 p-2 h-[244px]  justify-between items-center w-[53px]  space-x-1 rounded-[20px] bg-white shadow-xl'>
      <div className='flex md:flex-col space-y-3 md:items-center md'>
        <Button 
          routerName=''
          icon={<HomeIcon height={24} width={24} color="white"/>}/>
        <Button 
          routerName='chat'
          icon={<RiChatVoiceLine size={24} color="white"/>}/>
        <Button 
          routerName='record'
          icon={<MicrophoneIcon height={24} width={24} color="white"/>}/>
        <Button 
          routerName='playlist'
          icon={<MusicalNoteIcon height={24} width={24} color="white"/>}/>
      </div>
    )
}

export default NavigationButtons