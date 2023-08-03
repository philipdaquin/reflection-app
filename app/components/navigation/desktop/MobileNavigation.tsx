import React, { useState } from 'react'
import {DevicePhoneMobileIcon, ComputerDesktopIcon} from '@heroicons/react/24/outline'
import { DeviceTabletIcon } from '@heroicons/react/20/solid'

import {BsSuitHeartFill} from 'react-icons/bs'
import {MdOutlineReceiptLong} from 'react-icons/md'
import {HiChartBar, HiViewGrid} from 'react-icons/hi'
import {PlusIcon} from '@heroicons/react/24/solid'
import NavButton from '../mobile/NavButton'

interface Prop { 
    title: string, 
    icon: any,
    isSelected: boolean
    onClick: (version: string) => void
}

function Button({title, icon, isSelected, onClick}: Prop) { 
    return (
        <div  onClick={() => onClick(title)} 
            className={`
        ${isSelected ? 'bg-black text-white' : ''} cursor-pointer
        flex flex-row justify-between space-x-1 h-full rounded-[13px] w-full items-center px-3`}>
            {icon}
            <h2 className='text-left font-semibold text-[16px]'>{title}</h2>
        </div>
    )
}

function MobileNavigation() {

    const [selectedVersion, setSelectedVersion] = useState("Mobile")

    const handleSelect = (version: string) => { 
        setSelectedVersion(version)
    }

    return (
        <div className='w-fit px-[19px] space-x-4 justify-between items-center h-[52px] flex flex-row rounded-[18px] bg-white'
        style={{boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.25)'}}
        >
            <NavButton 
              routerName=''
              icon={<BsSuitHeartFill size={24} color='#000'/>}/>
            <NavButton 
              routerName=''
              icon={<MdOutlineReceiptLong size={24} color='#000'/>}/>
            <NavButton 
              routerName=''
              icon={<PlusIcon height={24} width={24} color="#000"/>}/>
            <NavButton 
              routerName=''
              icon={<HiChartBar size={24} color='#000'/>}/>
            <NavButton 
              routerName=''
              icon={<HiViewGrid size={24} color='#000'/>}/>

        </div>
    )
}

export default MobileNavigation


