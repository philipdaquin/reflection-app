import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function JournalThumbnail() {
    
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setloading] = useState(false)


    const handleAvatar = () => { 
        if (imageUrl) return  
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        // @ts-ignore
        input.onchange = handleFileChange
        input.click();

    }

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      setFile(file || null);
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);
      } else {
        setImageUrl(null);
      }
    };
  
    const handleUploadClick = async () => {
      if (!file) return;
    setloading(true)
      // Upload the file to the server
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload response:", data);
      setloading(true)
    };
    
    // Automatically upload the image 
    useEffect(() => {
        if (!imageUrl || !file) return 
        handleUploadClick()
    }, [imageUrl, file])

    const [clear, setClear] = useState(false)
    const showClearButton = () => { 
        setClear(!clear)
    }

    const deleteImage = () => { 
        setImageUrl(null)
    }

    return (
        <>
           
            <div onClick={handleAvatar} onMouseEnter={showClearButton} >
                {
                    imageUrl ? ( 
                    
                    <div className='relative'>
                        <Image src={imageUrl} 
                            className='rounded-[50px] object-fill border-[#F6F6F6] border-8 h-[200px] w-[200px]' 
                            alt='User Profile'  
                            height={200}
                            width={200}
                            quality={100}
                        /> 
                         <div className='absolute right-0 bottom-0 bg-[#424242] rounded-full p-2  items-center flex justify-center w-fit cursor-pointer ' onClick={deleteImage}  >
                            <XMarkIcon height={24} width={24} strokeWidth={2}  color="white" />
                        </div>
                    </div>
                    ) : (
                        // Placeholder 
                        <div className='rounded-[50px] items-center justify-center flex border-dotted cursor-pointer border-[#747474] border-2 h-[200px] w-[200px]'>
                            <h1>Upload photo</h1>
                        </div>
                    )
                }
            </div>
           
      </>
  )
}

export default JournalThumbnail