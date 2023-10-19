import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { AudioData, MAIN_SERVER, ProgressData } from "../typings"
import { useRouter } from "next/router"
import useLocalStorage, { OPENAI_KEY } from "./useLocalStorage"
import { Toaster, toast } from "react-hot-toast"
import ProgressBar from "../components/notification/ProgressBar"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { uploadAudioRecording } from "../util/audio/uploadAudioRecording"
import { useRecoilValue } from "recoil"
import { AddEntryToggle } from "../atoms/atoms"


interface UploadInterface { 
    currentProgress: number, 
    isUploading: boolean, 
    handleFileUpload: (file: File) => Promise<void>, 
    handleShowProgress: () => void,
    handleUpload: () => void,
}

const UploadContext = createContext<UploadInterface>({
    currentProgress: 0,
    isUploading: false, 
    handleFileUpload: async () => {},
    handleShowProgress: () => {},
    handleUpload: () => {},
})

interface Props { 
    children: React.ReactNode
}

export const UploadProgressProvider = ({children}: Props) => { 
    // Uploading Process
    const [apiKey, ] = useLocalStorage<string | null>(OPENAI_KEY, null) 
    const [loading, setLoading] = useState(false)
    const [promisedUploadEvent, setPromisedUploadEvent] = useState<Promise<void> | null>(null)
    const router = useRouter()  


    const [isUploading, setUploadState] = useState(false)
    const handleUpload = () => { 
        setUploadState(true)
    }


    /*
        Upload a file to be transcribed by 
    */
    const handleFileUpload = async (selectedFile: File | null) => {
        if (!selectedFile) return
        setLoading(true)
        const formData = new FormData();
        formData.append("audio.wav", selectedFile!);

        if (!apiKey) return
        const uploadEvent = uploadAudioRecording(formData, apiKey)
            .then((resp: AudioData) => { 
                router.push({pathname: `/post_analysis/${resp._id}`})
                setLoading(false)
                setUploadState(false)
            })
            .catch((e) => { 
                console.error("Failed to upload audio file", e);
            })
        setPromisedUploadEvent(uploadEvent)
    }
    
    const [showProgress, setShowProgress] = useState(false)
    const handleShowProgress = () => {
        setShowProgress((prevState) => !prevState);
    };


    useEffect(() => {
        if (loading 
            && showProgress 
            && promisedUploadEvent) {

            toast.promise(
                promisedUploadEvent, 
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
        }
      
    }, [showProgress, loading, promisedUploadEvent])
    

    // Reading Audio Process 
    const [currentProgress, setCurrentProgress] = useState(0)
   
    // Reference the event source 
    const eventSourceRef = useRef<EventSource | null>(null);

    const handleCurrentProgress = (progress: number) => { 
        setCurrentProgress(progress)
    }

    useEffect(() => {
        if (isUploading)  {
            eventSourceRef.current = new EventSource(`${MAIN_SERVER}/api/audio/events`);
            
            eventSourceRef.current.addEventListener('message', (event) => {
            const preData = JSON.parse(event.data);
            const data: ProgressData = preData  

            console.log(data)
                if (!data.progress) return
                handleCurrentProgress(data.progress);
                
            } )
        }
        return () => {
            if (eventSourceRef.current) { 
                eventSourceRef.current.close();
                handleCurrentProgress(0);
            }
        };
    }, [isUploading]);

    // TEMPORARY
    const audioModal = useRecoilValue(AddEntryToggle)
    useEffect(() => {
        if (isUploading && audioModal === false) {
            handleShowProgress()
        }
    }, [audioModal, isUploading])


    const memoValue = useMemo(() => ({ 
        currentProgress,
        handleUpload,
        isUploading,
        handleFileUpload,
        handleShowProgress
    }), [currentProgress, 
        handleUpload,
        isUploading,
        handleFileUpload,
        handleShowProgress
    ])
    
    return <UploadContext.Provider value={memoValue}>
        {children}
    </UploadContext.Provider>
}

export default function useUploadContext() { 
    return useContext(UploadContext)
}