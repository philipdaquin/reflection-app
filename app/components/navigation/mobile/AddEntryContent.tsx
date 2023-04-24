import Link from 'next/link'
import React from 'react'
import {ArrowUpTrayIcon, MicrophoneIcon} from '@heroicons/react/24/outline'
import { RiChatVoiceLine } from 'react-icons/ri'
import AddAudioFile from '../../AddAudioFile'


interface Props { 
    icon: any
    routerName: string
    title: string
}

function Button({icon, routerName, title}: Props) { 
    return (
        <Link href={`/${routerName}`} className='cursor-pointer flex justify-center flex-col items-center space-y-2'>
          <div className='bg-[#f5f5f5] rounded-[20px] w-[112px] flex justify-center py-4 cursor-pointer'>
            {icon}
          </div>
          <div className='text-[12px] text-center font-medium'>
            {title}
          </div>
        </Link>
    )
}

export function UploadButton() { 
    return (
        <div className='cursor-pointer flex justify-center flex-col items-center space-y-2'>
          <div className='bg-[#f5f5f5] rounded-[20px] w-[112px] flex justify-center py-4 cursor-pointer'>
            <ArrowUpTrayIcon height={24} width={24} color='#000'/>
          </div>
          <div className='text-[12px] text-center font-medium'>
                Upload Audio
          </div>
        </div>
    )
}




function AddEntryContent() {
       
       
       
       
       
       
  return (
    <div className='rounded-t-3xl w-full '>
        <div className='flex flex-col'>
            <h1 className='text-sm font-medium'>Add a new journal entry</h1>
            <h3 className='text-xs text-[#757575]'>Add a new journal in three ways:</h3>
        </div>

        <div className=' flex flex-row w-full pt-[40px]'>
            <AddAudioFile>
              <UploadButton/>
            </AddAudioFile>
            <Button
                icon={<RiChatVoiceLine size={24} color="#000"/> }
                routerName=''
                title='Upload Audio' 
            />
            <Button
                icon={
                    <MicrophoneIcon height={24} width={24} color="#000"/>
                }
                routerName=''
                title='Upload Audio' 
            />
        </div>

    </div>
  )
}

export default AddEntryContent