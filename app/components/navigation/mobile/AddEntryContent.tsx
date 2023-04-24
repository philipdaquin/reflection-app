import Link from 'next/link'
import React from 'react'
import {ArrowUpTrayIcon, MicrophoneIcon, XMarkIcon} from '@heroicons/react/24/outline'
import { RiChatVoiceLine } from 'react-icons/ri'
import AddAudioFile from '../../AddAudioFile'
import { useRecoilState } from 'recoil'
import { AddEntryToggle } from '../../../atoms/atoms'


interface Props { 
    icon: any
    routerName: string
    title: string
}

function Button({icon, routerName, title}: Props) { 
    return (
        <Link href={`/${routerName}`} className='cursor-pointer flex justify-center flex-col items-center space-y-2'>
          <div className='bg-[#f5f5f5] rounded-[20px] w-[100px] flex justify-center py-2 cursor-pointer'>
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
          <div className='bg-[#f5f5f5] rounded-[20px] w-[100px] flex justify-center py-2 cursor-pointer'>
            <ArrowUpTrayIcon height={24} width={24} color='#000'/>
          </div>
          <div className='text-[12px] text-center font-medium'>
                Upload Audio
          </div>
        </div>
    )
}

function CloseModal() { 
  const [showModal, setShowModal] = useRecoilState(AddEntryToggle);

  return (
    <div onClick={() => setShowModal(false)} 
        className='cursor-pointer p-2 w-[30px] h-[30px] items-center flex justify-center bg-[#e0e0e0] rounded-full '>
      <XMarkIcon height={24} width={24} color="#757575" strokeWidth={4}/>
    </div>
  )
}


function AddEntryContent() {
       
  return (
    <div className='rounded-t-3xl w-full bg-white shadow-2xl absolute bottom-0 h-[220px] px-7 py-4'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-col'>
              <h1 className='text-lg font-semibold text-left'>Add a new journal entry</h1>
              <h3 className='text-xs text-[#757575]'>Add a new journal in three ways:</h3>
          </div>
          <CloseModal />
        </div>
        <div className=' flex flex-row w-full pt-[24px]  justify-between'>
            <AddAudioFile>
              <UploadButton/>
            </AddAudioFile>
            <Button
                icon={<RiChatVoiceLine size={24} color="#000"/> }
                routerName='/chat'
                title='Chat with AI' 
            />
            <Button
                icon={
                    <MicrophoneIcon height={24} width={24} color="#000"/>
                }
                routerName='/record'
                title='Record Audio' 
            />
        </div>
        <p className='text-xs text-[#757575] pt-7 font-medium'>**Only WAV Files are currently supported.</p>
    </div>
  )
}

export default AddEntryContent