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
    const [loading, setloading] = useState(false)
    const router = useRouter()

    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [showPlayer, setshowAudioPlayer] = useRecoilState(ShowAudioPlayer)


    const {currentProgress, isUploading} = useUploadContext()

    const handleAvatar = () => {    
        if (selectedFile) return  
        const input = document.createElement("input");
        // input.id = "audioFile";
        input.type = "file";
        input.accept = ".wav";
        // @ts-ignore
        input.onchange = handleFileChange
        input.click();
    }
    const [apiKey, setApiKey] = useLocalStorage<string | null>(OPENAI_KEY, null) 

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault()
        const file = ev.target.files?.[0];

        if (!file) return 
        setSelectedFile(file);
        
        if (file) {
            isFileSelected(true)
        } else { 
            isFileSelected(false)
        }
      };

    const showModel = useRecoilValue(AddEntryToggle);
    const handleFormSubmit = async () => {
        if (!selectedFile) return
        setloading(true)
        setCurrentFile(selectedFile)
        setshowAudioPlayer(false)
        const formData = new FormData();
        formData.append("audio.wav", selectedFile!);
        if (apiKey === null) throw new Error("Failed to get Open AI key")

        const uploadFile = new Promise((resolve, reject) => { 

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:4001/api/audio/batch-upload");
            xhr.setRequestHeader("Authorization", `Bearer ${apiKey}`);
            xhr.upload.addEventListener("progress", (e) =>  { 
                if (e.lengthComputable) { 
                    const percent = (e.loaded / e.total) * 100;
                }
            })
            xhr.onload = async () => { 
                if (xhr.status === 200) { 
                    const preResp = JSON.parse(xhr.response)
                    const resp: AudioData = preResp
                    router.push({ 
                        pathname: `/post_analysis/${resp._id}`
                    })
                    resolve(resp);
                    setCurrentFile(null)
                } else { 
                    reject(new Error("Failed to get audio file"));
                }
            }
            xhr.send(formData)
        })
        toast.promise(
            uploadFile,
             {
               loading: 
                    <div className='
                    flex flex-row justify-between items-center w-[200px] space-x-5 h-[45px] py-2'>
                      <ProgressBar/>
                      <button 
                        //@ts-ignore
                        onClick={() => toast.dismiss(t.id)} 
                        className='cursor-pointer p-1 w-[20px] h-[20px] items-center flex justify-center bg-[#e0e0e0] rounded-full '>
                          <XMarkIcon height={16} width={16} color="#757575" strokeWidth={3}/>
                       </button>
                    </div>,
               success: <b>Completed!</b>,
               error: <b>Unable to process audio.</b>,
             }
           );
   
    };

    // Temporary
    useEffect(() => {
        if (!isUploading) return 
        if (!selectedFile) return

        handleFormSubmit()
    }, [isUploading, selectedFile, isFileSelected])

    const removeFile = () => { 
        setSelectedFile(null)
        setCurrentFile(null)
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