import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ProgressData } from "../typings"


interface UploadInterface { 
    currentProgress: number, 
    isUploading: boolean, 
    handleUpload: () => void,
}

const UploadContext = createContext<UploadInterface>({
    currentProgress: 0,
    isUploading: false, 
    handleUpload: () => {},
})

interface Props { 
    children: React.ReactNode
}

export const UploadProgressProvider = ({children}: Props) => { 
    const [currentProgress, setCurrentProgress] = useState(0)
    const [isUploading, setUploadState] = useState(false)

    // Reference the event source 
    const eventSourceRef = useRef<EventSource | null>(null);

    const handleUpload = () => { 
        setUploadState(!isUploading)
    }

    const handleCurrentProgress = (progress: number) => { 
        setCurrentProgress(progress)
    }

    useEffect(() => {
        if (isUploading)  {
            eventSourceRef.current = new EventSource('http://localhost:4001/api/audio/events');
            
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


    const memoValue = useMemo(() => ({ 
        currentProgress,
        handleUpload,
        isUploading
    }), [currentProgress, 
        handleUpload,
        isUploading
    ])
    


    return <UploadContext.Provider value={memoValue}>
        {children}
    </UploadContext.Provider>
}

export default function useUploadContext() { 
    return useContext(UploadContext)
}