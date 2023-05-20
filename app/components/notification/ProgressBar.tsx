import React from 'react'
import { UploadProgress } from '../AddAudioFile'
import useUploadContext from '../../hooks/useUploadProgress'
import { XMarkIcon } from '@heroicons/react/24/outline'

function ProgressBar() {
    const {currentProgress} = useUploadContext()

    return (
        <div className='w-[150px] h-fit items-center flex flex-col justify-center'>
            <UploadProgress currentProgress={currentProgress}/>
            <h1 className='font-medium text-[13px]'>
                Processing Audio File..
            </h1>
           
        </div>
    )
}

export default ProgressBar