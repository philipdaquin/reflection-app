import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AudioData, ProgressData } from '../typings';
import useLocalStorage from '../hooks/useLocalStorage';
import { OPENAI_KEY } from './SettingsButtons';
import { BsSoundwave } from 'react-icons/bs';
import {XMarkIcon} from '@heroicons/react/24/outline'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AddEntryToggle, CurrentProgress, ModalState, ShowAudioPlayer } from '../atoms/atoms';
import { toast } from 'react-hot-toast';
import { toDate } from 'date-fns';
import useUploadContext from '../hooks/useUploadProgress';
import ProgressBar from './notification/ProgressBar';


interface ProgressProps { 
    currentProgress: number,
}
export function UploadProgress({currentProgress}: ProgressProps) { 
    return (
        <div className=' flex flex-row w-full space-x-2 pt-2 items-center '>
            <div className=' bg-gray-200 rounded-full w-full h-2 overflow-hidden'>
                <div className='bg-black h-full  rounded-full w-full' style={{width: `${currentProgress}%`}}>
                </div>
            </div>
            <div className="text-center text-sm relative font-bold">{currentProgress.toFixed(1)}%</div>
        </div>
    )
}

interface Props { 
    children: any,
    isFileSelected: any
}

function AddAudioFile({children, isFileSelected}: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const {currentProgress, isUploading, handleFileUpload} = useUploadContext()

    const handleAvatar = () => {    
        // if (selectedFile) return  
        const input = document.createElement("input");
        // input.id = "audioFile";
        input.type = "file";
        input.accept = ".wav";
        // @ts-ignore
        input.onchange = handleFileChange
        input.click();
    }

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault()
        const file = ev.target.files?.[0];

        // if (!file) return 
        if (file) {
            setSelectedFile(file);
            isFileSelected(true)
        } else { 
            isFileSelected(false)
        }
      };
    // Temporary
    useEffect(() => {
        if (!isUploading) return 
        if (!selectedFile) return 
        handleFileUpload(selectedFile)
    }, [isUploading, selectedFile, isFileSelected])

    const removeFile = () => { 
        setSelectedFile(null)
        isFileSelected(false)
    }
 
    return (

            <>
                <div onClick={handleAvatar} className='pb-4'>
                    {children}
                </div>

                {selectedFile && (
                    <>
                        <div className='flex px-2  border-[1px] border-[#e0e0e0] py-2 rounded-[15px] items-start justify-between'>  
                            <div className='flex flex-col w-full'>
                                <div className='flex space-x-2'>
                                    <div className='px-2 py-2 rounded-lg border-[1px] w-fit border-[#cfcfcf]  items-center flex flex-row justify-center'>
                                        <BsSoundwave  size={24} color='black' />
                                    </div>
                                    <div className='flex flex-col text-left '>
                                        <h1 className='font-semibold'>
                                            {selectedFile?.name}
                                        </h1>
                                        <p className='text-left text-[#757575] text-sm'>
                                            {selectedFile && `${(selectedFile?.size / 1000000).toFixed(2)} MB`}
                                        </p>
                                    </div>
                                </div>
                                {currentProgress > 0 && (
                                   <UploadProgress currentProgress={currentProgress}/>
                                )} 
                            </div>
                            <div onClick={removeFile} className='cursor-pointer'>
                                <XMarkIcon  height={20} width={20} color='#9e9e9e' />
                            </div> 
                        </div>
                    </>
                )}
            </>

    )
}

export default AddAudioFile