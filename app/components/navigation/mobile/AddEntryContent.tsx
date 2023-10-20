import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {ArrowUpTrayIcon, MicrophoneIcon, XMarkIcon, FolderPlusIcon} from '@heroicons/react/24/outline'
import { RiChatVoiceLine } from 'react-icons/ri'
import AddAudioFile from '../../AddAudioFile'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AddEntryToggle } from '../../../atoms/atoms'
import { AnimatePresence, motion } from "framer-motion";
import useUploadContext from '../../../hooks/useUploadProgress'


interface Props { 
    children: any
    routerName: string
    title: string
}

function Button({children, routerName, title}: Props) { 
    return (
        <Link href={`/${routerName}`} className='cursor-pointer flex justify-center flex-col items-center space-y-2'>
          <div className='bg-[#f5f5f5] rounded-[20px] w-[100px] flex justify-center py-2 cursor-pointer'>
            {children}
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

interface UploadContent { 
  prevPage: any
}

function UploadContent({prevPage}: UploadContent) { 
  // const [uploadFile, setUploadFile] = useState(false)
  const [isAudioFileSelected, SelectAudioFile] = useState(false)
  const {isUploading, handleUpload, handleShowProgress, } = useUploadContext()  

  return (
    <>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold text-left'>
            {
              isUploading ? (
                'Creating a new journal entry...'
                ) : (
                'Upload an Audio Recording'
              )
            }

          </h1>
          <h3 className='text-xs text-[#757575]'>
            
            {
              isUploading ? (
                'You will be redirected shortly.'
              ) : (
                'Attach an Audio Recording to this entry.'
              )
            }

          </h3>
        </div>
        <CloseModal />
      </div>
      
      
      <div className='pt-7 pb-4'>
        <AddAudioFile isFileSelected={SelectAudioFile}>

          {
            !isUploading && (
              <section className='w-full rounded-[20px] border-[2px] border-[#757575] 
              flex flex-col justify-center items-center py-4 border-dashed cursor-pointer'>
                <ArrowUpTrayIcon height={40} width={40} color='#757575' strokeWidth={1}/>
                
                <div className='items-center text-center pt-2'>
                  <h1 className='font-semibold text-sm'>    
                    Browse audio files on your device.
                  </h1>
                  <p className='text-xs text-[#757575]'>
                    **Only WAV files are currently supported.
                  </p>
                </div>
              </section>
            ) 
          }
        </AddAudioFile>
      </div>
      
      <hr />  

      <div className='w-full justify-between flex flex-row items-center pt-4 pb-4 space-x-2'>
        <div hidden={isUploading} onClick={prevPage} className='bg-[#fafafa] cursor-pointer border-2 font-medium text-sm border-[#e0e0e0] rounded-[10px]  py-2 text-[#757575] w-full  text-center '>
          Cancel
        </div>
        <button onClick={handleUpload} disabled={!isAudioFileSelected || isUploading} className={`
         ${isAudioFileSelected ? 'bg-[#212121] text-white' : 'bg-[#e0e0e0] text-[#757575] '}
         cursor-pointer border-2 font-medium text-sm border-[#e0e0e0] rounded-[10px]  py-2  w-full text-center `}>
          {
            isUploading ? ('Uploading...') : ('Continue')
          }
        </button>
      </div>

    </>
  )
}


export function CloseModal() { 
  const [showModal, setShowModal] = useRecoilState(AddEntryToggle);

  return (
    <div onClick={() => setShowModal(false)} 
        className='cursor-pointer p-2 w-[30px] h-[30px] items-center flex justify-center bg-[#e0e0e0] rounded-full '>
      <XMarkIcon height={24} width={24} color="#757575" strokeWidth={4}/>
    </div>
  )
}


interface MenuProps { 
  nextPage: any
}

function MenuContent({nextPage}: MenuProps) { 
  return (
    <>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold text-left'>Add a new journal entry</h1>
          <h3 className='text-xs text-[#757575]'>Add a new journal in three ways:</h3>
        </div>
        <CloseModal />
      </div>
      <div className=' flex flex-row w-full pt-[24px]  justify-between'>
        
        <div onClick={nextPage}>
          <UploadButton/>
        </div>

        {/* <Button routerName='/chat' title='Chat with AI'>
          <RiChatVoiceLine size={24} color="#000"/>
        </Button> */}
        <Button routerName='' title='Chat with AI (Unavailable)'>
          <RiChatVoiceLine size={24} color="#000"/>
        </Button>




        <Button routerName='record' title='Record Audio'>
          <MicrophoneIcon height={24} width={24} color="#000"/>
        </Button>
      </div>
        <p className='text-xs text-[#757575] pt-10 font-medium pb-6'>**Only WAV Files are currently supported.</p>
    </>
  )
}



function AddEntryContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <motion.div 
    initial={{ y: "100%" }}
    animate={{
      y: "0%",
      transition: { duration: 0.5, ease: [0.36, 0.66, 0.04, 1] },
    }}
    exit={{
      y: "100%",
      transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
    }}
    className={`rounded-t-3xl rounded-b-none  w-full bg-white shadow-2xl 
      fixed md:absolute bottom-0 h-fit px-7 py-4 `}
    >
      {currentPage === 1 && (<MenuContent nextPage={nextPage} />)}
      {currentPage === 2 && (<UploadContent prevPage={prevPage}/>)}
      {/* {currentPage === 3 && (<ProgressContent/>) } */}
    </motion.div>
  )
}

export default AddEntryContent


