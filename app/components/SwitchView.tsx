import React, { useState } from 'react'
import {DevicePhoneMobileIcon, ComputerDesktopIcon} from '@heroicons/react/24/outline'

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
        ${isSelected ? 'bg-black text-white' : ''}
        flex flex-row justify-between space-x-1 h-full rounded-[13px] w-full items-center px-3`}>
            {icon}
            <h2 className='text-left font-semibold text-[16px]'>{title}</h2>
        </div>
    )
}

function SwitchView() {

    const [selectedVersion, setSelectedVersion] = useState("Mobile")

    const handleSelect = (version: string) => { 
        setSelectedVersion(version)
    }

    return (
        <div className='p-2 w-[244px]  justify-between items-center h-[53px] flex flex-row space-x-1 rounded-[20px] bg-white shadow-xl'>
                <Button icon={<ComputerDesktopIcon height={24} width={24}/>}
                        title={"Desktop"}
                        isSelected={selectedVersion === "Desktop"}
                        onClick={() => handleSelect("Desktop")}

                />
                <Button icon={<DevicePhoneMobileIcon height={24} width={24}/>}
                        title={"Mobile"}
                        isSelected={selectedVersion === "Mobile"}
                        onClick={() => handleSelect("Mobile")}
                />
        </div>
    )
}

export default SwitchView


