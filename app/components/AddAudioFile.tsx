import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AudioData, ProgressData } from '../typings';
import useLocalStorage from '../hooks/useLocalStorage';
import { OPENAI_KEY } from './SettingsButtons';
import { BsSoundwave } from 'react-icons/bs';
import {XMarkIcon} from '@heroicons/react/24/outline'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';


interface Props { 
    children: any,
    uploadFile: boolean
    isFileSelected: any
}

function AddAudioFile({children, uploadFile, isFileSelected}: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setloading] = useState(false)
    const router = useRouter()
    const [progress, setProgress] = useState(0)

    const [currentFile, setCurrentFile] = useState<File | null>(null)


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

    

    const handleFormSubmit = async () => {

        if (!selectedFile) return
        setloading(true)
        setCurrentFile(selectedFile)
        const formData = new FormData();
        formData.append("audio.wav", selectedFile!);
        if (apiKey === null) throw new Error("Failed to get Open AI key")

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:4001/api/audio/batch-upload");
        xhr.setRequestHeader("Authorization", `Bearer ${apiKey}`);
        xhr.upload.addEventListener("progress", (e) =>  { 
            if (e.lengthComputable) { 
                const percent = (e.loaded / e.total) * 100;
                setProgress(percent)
            }
        })

        xhr.onload = async () => { 
            if (xhr.status === 200) { 
                const resp: AudioData = JSON.parse(xhr.response)
                router.push({ 
                    pathname: `/post_analysis/${resp._id}`
                })
                setCurrentFile(null)
            } else { 
                throw new Error("Failed to get audio file")
            }
        }
        xhr.send(formData)
    };


    // Temporary
    useEffect(() => {
        if (!uploadFile) return 
        if (!selectedFile) return

        handleFormSubmit()
    }, [uploadFile, selectedFile, isFileSelected])

    const removeFile = () => { 
        setSelectedFile(null)
        setCurrentFile(null)
        isFileSelected(false)
    }
    const [currentProgress, setCurrentProgress] = useState(0)
    useEffect(() => {
        if (!uploadFile) return 
        const eventSource = new EventSource('http://localhost:4001/api/audio/events');
        
        eventSource.addEventListener('message', (event) => {
          const data: ProgressData = JSON.parse(event.data);
            
          console.log(data)
            if (!data.progress) return

            setCurrentProgress(data.progress);
        });
    
        return () => {
          eventSource.close();
        };
      }, [uploadFile]);

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
                                            {/* <div>
                                                SSE
                                                {currentProgress}
                                            </div> */}
                                        </div>
                                    </div>
                                    {currentProgress > 0 && (
                                        <div className=' flex flex-row w-full space-x-2 pt-2 items-center '>
                                            <div className=' bg-gray-200 rounded-full w-full h-2 overflow-hidden'>
                                                <div className='bg-black h-full  rounded-full w-full' style={{width: `${currentProgress}%`}}>
                                                </div>
                                            </div>
                                            <div className="text-center text-sm relative font-bold">{currentProgress.toFixed(1)}%</div>
                                        </div>
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