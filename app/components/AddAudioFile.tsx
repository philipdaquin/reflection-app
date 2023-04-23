import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { convertWav } from '../util/convertWav';
import { getRelatedTags } from '../util/getRelatedTags';
import { getTextSummary } from '../util/getTextSummary';
import { uploadChatRecording } from '../util/uploadChatRecording';
import { AudioData } from '../typings';
import useLocalStorage from '../hooks/useLocalStorage';
import { OPENAI_KEY } from './SettingsButtons';
import { getOpenAPIKey } from '../pages';
import { uploadAudioRecording } from '../util/uploadAudioRecording';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Props { 
    children: any
}

function AddAudioFile({children}: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setloading] = useState(false)
    const router = useRouter()


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
        const file = ev.target.files?.[0];
        setSelectedFile(file || null);
        // if (file) {
        //   const imageUrl = URL.createObjectURL(file);
        //   setImageUrl(imageUrl);
        // } else {
        //   setImageUrl(null);
        // }
      };



    const handleFormSubmit = async () => {
        if (!selectedFile) return
        setloading(true)

        const formData = new FormData();

        formData.append("audio.wav", selectedFile!);
        if (apiKey === null) throw new Error("Failed to get Open AI key")


        console.log(apiKey)

        const headers = {
            "Authorization": `Bearer ${apiKey}`,
        };
        fetch("http://localhost:4001/api/audio/batch-upload", {
            method: "POST",
            body: formData,
            headers
        })
        .then(async (response) => {
            if (response.ok) {
                const resp: AudioData = await response.json()
                router.push({
                    pathname: `/post_analysis/${resp._id}`,
                })

          } else { 
            throw new Error("Failed to get audio file")
          }
        })
        .catch((error) => {
            throw new Error(error)
        });
    };

    return (

            <>
                <div onClick={handleAvatar}>
                    {children}
                </div>
                <button onClick={handleFormSubmit}>Upload</button>
            </>

    )
}

export default AddAudioFile