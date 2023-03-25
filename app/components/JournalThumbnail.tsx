import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function JournalThumbnail() {
    
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    
    const handleAvatar = () => { 
        if (imageUrl) return  
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        
        input.onchange = handleFileChange;
        input.click();

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
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
  
      // Upload the file to the server
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload response:", data);
    };
    
    useEffect(() => {
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
                            className='rounded-[50px] object-fill border-[#F6F6F6] border-8 h-[156px] w-[156px]' 
                            alt='User Profile'  
                            height={156}
                            width={156}
                            quality={100}
                        /> 
                         <div className='absolute right-0 bottom-0 bg-[#424242] rounded-full p-2  items-center flex justify-center w-fit cursor-pointer ' onClick={deleteImage}  >
                            <XMarkIcon height={24} width={24} strokeWidth={2}  color="white" />
                        </div>
                    </div>
                    ) : (
                        // Placeholder 
                        <div className='rounded-[50px] items-center justify-center flex border-dotted cursor-pointer border-[#747474] border-2 h-[156px] w-[156px]'>
                            <h1>Upload photo</h1>
                        </div>
                    )
                }
            </div>
           
      </>
  )
}

export default JournalThumbnail